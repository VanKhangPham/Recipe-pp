using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using RecipeHub.Application.Identity;

namespace RecipeHub.Api.Identity;

public static class AuthRegistration
{
    public static IServiceCollection AddRecipeHubAuthentication(this IServiceCollection services,
        IConfiguration configuration, IWebHostEnvironment environment)
    {
        services.AddSingleton(provider =>
        {
            var config = provider.GetRequiredService<IConfiguration>();
            var host = provider.GetRequiredService<IWebHostEnvironment>();
            var key = config["Jwt:Key"];
            if (string.IsNullOrWhiteSpace(key) && host.IsDevelopment())
            {
                key = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
                provider.GetRequiredService<ILogger<JwtTokenIssuer>>().LogWarning(
                    "Development uses a temporary JWT signing key. Access tokens expire on application restart. Configure Jwt:Key for a stable key.");
            }
            if (string.IsNullOrWhiteSpace(key) || Encoding.UTF8.GetByteCount(key) < 64)
                throw new InvalidOperationException("Configure Jwt:Key with at least 64 UTF-8 bytes using secrets or environment variables.");
            return new JwtSettings(config["Jwt:Issuer"] ?? "RecipeHub", config["Jwt:Audience"] ?? "RecipeHub.Web", key);
        });
        services.AddSingleton<IAccessTokenIssuer, JwtTokenIssuer>();
        services.AddScoped<AuthRequestFilter>();
        services.AddExceptionHandler<AuthExceptionHandler>();
        services.AddAntiforgery(options =>
        {
            options.HeaderName = "X-CSRF-TOKEN";
            options.Cookie.Name = "recipehub.csrf";
            options.Cookie.HttpOnly = true;
            options.Cookie.SameSite = SameSiteMode.Lax;
            options.Cookie.SecurePolicy = environment.IsDevelopment() ? CookieSecurePolicy.SameAsRequest : CookieSecurePolicy.Always;
        });
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer();
        services.AddOptions<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme).Configure<JwtSettings>((options, settings) =>
        {
            options.MapInboundClaims = false;
            options.IncludeErrorDetails = false;
            options.Events = new JwtBearerEvents
            {
                OnTokenValidated = async context =>
                {
                    if (!Guid.TryParse(context.Principal?.FindFirst("sub")?.Value, out var userId))
                    {
                        context.Fail("Invalid account identifier.");
                        return;
                    }
                    var auth = context.HttpContext.RequestServices.GetRequiredService<IAuthService>();
                    try
                    {
                        await auth.GetProfileAsync(userId, context.HttpContext.RequestAborted);
                    }
                    catch (AuthException exception) when (exception.Error == AuthError.Unauthorized)
                    {
                        context.Fail("Account is unavailable.");
                    }
                }
            };
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true, ValidIssuer = settings.Issuer,
                ValidateAudience = true, ValidAudience = settings.Audience,
                ValidateLifetime = true, RequireExpirationTime = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings.Key)),
                ValidAlgorithms = [SecurityAlgorithms.HmacSha256],
                ClockSkew = TimeSpan.FromSeconds(30),
                NameClaimType = "sub", RoleClaimType = ClaimTypes.Role
            };
        });
        services.AddAuthorization(options => options.AddPolicy("Admin", policy => policy.RequireRole("Admin")));
        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
            options.OnRejected = async (context, cancellationToken) =>
            {
                if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
                    context.HttpContext.Response.Headers.RetryAfter = Math.Ceiling(retryAfter.TotalSeconds).ToString(System.Globalization.CultureInfo.InvariantCulture);
                await Results.Problem(statusCode: 429, title: "Too many authentication requests.")
                    .ExecuteAsync(context.HttpContext);
            };
            options.AddPolicy("auth", context => RateLimitPartition.GetFixedWindowLimiter(
                context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                _ => new FixedWindowRateLimiterOptions { PermitLimit = 30, Window = TimeSpan.FromMinutes(1), QueueLimit = 0 }));
            options.AddPolicy("views", context => RateLimitPartition.GetFixedWindowLimiter(
                context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                _ => new FixedWindowRateLimiterOptions { PermitLimit = 30, Window = TimeSpan.FromMinutes(1), QueueLimit = 0 }));
        });
        return services;
    }
}
