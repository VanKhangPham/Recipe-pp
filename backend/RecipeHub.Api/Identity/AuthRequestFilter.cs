using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Mvc.Filters;
using RecipeHub.Application.Identity;

namespace RecipeHub.Api.Identity;

public sealed class AuthRequestFilter(IAntiforgery antiforgery, IConfiguration configuration) : IAsyncAuthorizationFilter
{
    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var request = context.HttpContext.Request;
        var origin = request.Headers.Origin.ToString();
        var allowed = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
        var sameOrigin = $"{request.Scheme}://{request.Host}";
        if (!string.IsNullOrEmpty(origin) && origin != sameOrigin && !allowed.Contains(origin, StringComparer.OrdinalIgnoreCase))
            throw new AuthException(AuthError.Validation, "Request origin is not allowed.");
        try
        {
            await antiforgery.ValidateRequestAsync(context.HttpContext);
        }
        catch (AntiforgeryValidationException)
        {
            throw new AuthException(AuthError.Validation, "Invalid CSRF token. Fetch /api/v1/auth/csrf and retry.");
        }
    }
}
