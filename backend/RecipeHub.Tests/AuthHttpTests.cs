using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using RecipeHub.Application.Identity;
using RecipeHub.Api.Identity;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using Xunit;

namespace RecipeHub.Tests;

// HTTP/JWT/CSRF tests use a fake application service. Real persistence is tested separately.
public sealed class AuthHttpTests
{
    private static WebApplicationFactory<Program> CreateFactory() => new TestApiFactory().WithWebHostBuilder(builder =>
        builder.ConfigureTestServices(services =>
        {
            services.Replace(ServiceDescriptor.Scoped<IAuthService, FakeAuthService>());
            services.AddControllers().AddApplicationPart(typeof(AuthorizationProbeController).Assembly);
        }));

    [Fact]
    public async Task AdminPolicy_RejectsUserRoleAndAcceptsAdminRole()
    {
        using var factory = CreateFactory();
        using var client = factory.CreateClient();
        var issuer = factory.Services.GetRequiredService<IAccessTokenIssuer>();
        var profile = new UserProfile(Guid.NewGuid(), "role-test@example.test", "Role test", ["User"], DateTimeOffset.UtcNow);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", issuer.Issue(profile).Value);
        Assert.Equal(HttpStatusCode.Forbidden, (await client.GetAsync("/_tests/admin")).StatusCode);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", issuer.Issue(profile with { Roles = ["Admin"] }).Value);
        Assert.Equal(HttpStatusCode.OK, (await client.GetAsync("/_tests/admin")).StatusCode);
    }

    [Theory]
    [InlineData("expired")]
    [InlineData("wrongAudience")]
    [InlineData("wrongIssuer")]
    [InlineData("wrongKey")]
    public async Task BearerValidation_RejectsInvalidClaimsOrSignature(string scenario)
    {
        using var factory = CreateFactory();
        using var client = factory.CreateClient();
        var settings = factory.Services.GetRequiredService<JwtSettings>();
        var key = scenario == "wrongKey" ? Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)) : settings.Key;
        var jwt = new JwtSecurityToken(
            scenario == "wrongIssuer" ? "untrusted" : settings.Issuer,
            scenario == "wrongAudience" ? "untrusted" : settings.Audience,
            [new Claim("sub", Guid.NewGuid().ToString())],
            notBefore: DateTime.UtcNow.AddHours(-2),
            expires: scenario == "expired" ? DateTime.UtcNow.AddHours(-1) : DateTime.UtcNow.AddMinutes(15),
            signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)), SecurityAlgorithms.HmacSha256));
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", new JwtSecurityTokenHandler().WriteToken(jwt));
        Assert.Equal(HttpStatusCode.Unauthorized, (await client.GetAsync("/api/v1/users/me")).StatusCode);
    }

    [Fact]
    public async Task CurrentUser_RejectsMissingOrInvalidBearer()
    {
        using var factory = CreateFactory();
        using var client = factory.CreateClient();
        Assert.Equal(HttpStatusCode.Unauthorized, (await client.GetAsync("/api/v1/users/me")).StatusCode);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "invalid-token");
        Assert.Equal(HttpStatusCode.Unauthorized, (await client.GetAsync("/api/v1/users/me")).StatusCode);
    }

    [Fact]
    public async Task Login_RequiresCsrfAndRejectsUntrustedOrigin()
    {
        using var factory = CreateFactory();
        using var client = factory.CreateClient();
        var login = new LoginRequest("test@example.test", "Temporary1!Password");
        Assert.Equal(HttpStatusCode.BadRequest, (await client.PostAsJsonAsync("/api/v1/auth/login", login)).StatusCode);
        await AddCsrfAsync(client);
        client.DefaultRequestHeaders.Add("Origin", "https://untrusted.example");
        Assert.Equal(HttpStatusCode.BadRequest, (await client.PostAsJsonAsync("/api/v1/auth/login", login)).StatusCode);
    }

    [Fact]
    public async Task Login_ReturnsJwtAndHttpOnlyCookie_WithoutRefreshTokenInJson()
    {
        using var factory = CreateFactory();
        using var client = factory.CreateClient();
        await AddCsrfAsync(client);
        var response = await client.PostAsJsonAsync("/api/v1/auth/login", new LoginRequest("test@example.test", "Temporary1!Password"));
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var json = await response.Content.ReadAsStringAsync();
        Assert.DoesNotContain("refreshToken", json, StringComparison.OrdinalIgnoreCase);
        var result = JsonSerializer.Deserialize<TokenResponse>(json, new JsonSerializerOptions(JsonSerializerDefaults.Web))!;
        Assert.Equal(900, result.ExpiresIn);
        var cookie = Assert.Single(response.Headers.GetValues("Set-Cookie"), value => value.StartsWith("recipehub.refresh="));
        Assert.Contains("httponly", cookie, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("samesite=lax", cookie, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("path=/api/v1/auth", cookie, StringComparison.OrdinalIgnoreCase);
        Assert.Equal("no-store", response.Headers.CacheControl?.ToString());
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", result.AccessToken);
        Assert.Equal(HttpStatusCode.OK, (await client.GetAsync("/api/v1/users/me")).StatusCode);
    }

    [Fact]
    public async Task Register_ValidatesInputAndCannotAcceptAdminRole()
    {
        using var factory = CreateFactory();
        using var client = factory.CreateClient();
        await AddCsrfAsync(client);
        var invalid = await client.PostAsJsonAsync("/api/v1/auth/register", new { email = "not-email", password = "short", displayName = "" });
        Assert.Equal(HttpStatusCode.BadRequest, invalid.StatusCode);
        var response = await client.PostAsJsonAsync("/api/v1/auth/register", new
        {
            email = "test@example.test", password = "Temporary1!Password", displayName = "Test", role = "Admin"
        });
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var profile = await response.Content.ReadFromJsonAsync<UserProfile>();
        Assert.Equal(["User"], profile!.Roles);
    }

    [Fact]
    public async Task RefreshWithoutCookie_Returns401_AndLogoutWithoutSessionIsIdempotent()
    {
        using var factory = CreateFactory();
        using var client = factory.CreateClient();
        await AddCsrfAsync(client);
        Assert.Equal(HttpStatusCode.Unauthorized, (await client.PostAsync("/api/v1/auth/refresh", null)).StatusCode);
        Assert.Equal(HttpStatusCode.NoContent, (await client.PostAsync("/api/v1/auth/logout", null)).StatusCode);
        Assert.Equal(HttpStatusCode.NoContent, (await client.PostAsync("/api/v1/auth/logout", null)).StatusCode);
    }

    [Fact]
    public async Task AuthRateLimit_Returns429AfterBurst()
    {
        using var factory = CreateFactory();
        using var client = factory.CreateClient();
        for (var i = 0; i < 30; i++)
            Assert.Equal(HttpStatusCode.OK, (await client.GetAsync("/api/v1/auth/csrf")).StatusCode);
        Assert.Equal(HttpStatusCode.TooManyRequests, (await client.GetAsync("/api/v1/auth/csrf")).StatusCode);
    }

    internal static async Task AddCsrfAsync(HttpClient client)
    {
        // Auth cookie endpoints must use a CSRF token for the same (anonymous) auth flow.
        var response = await client.GetAsync("/api/v1/auth/csrf");
        response.EnsureSuccessStatusCode();
        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        client.DefaultRequestHeaders.Remove("X-CSRF-TOKEN");
        client.DefaultRequestHeaders.Add("X-CSRF-TOKEN", json.GetProperty("requestToken").GetString());
    }
}

internal sealed class FakeAuthService(IAccessTokenIssuer issuer) : IAuthService
{
    private static readonly UserProfile User = new(Guid.NewGuid(), "test@example.test", "Test", ["User"], DateTimeOffset.UtcNow);
    public Task<UserProfile> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken) => Task.FromResult(User);
    public Task<AuthSession> LoginAsync(LoginRequest request, CancellationToken cancellationToken) => Task.FromResult(
        new AuthSession(issuer.Issue(User), User, Convert.ToHexString(RandomNumberGenerator.GetBytes(64)), DateTimeOffset.UtcNow.AddDays(7)));
    public Task<AuthSession> RefreshAsync(string refreshToken, CancellationToken cancellationToken) => throw new NotImplementedException();
    public Task LogoutAsync(string? refreshToken, CancellationToken cancellationToken) => Task.CompletedTask;
    public Task<UserProfile> GetProfileAsync(Guid userId, CancellationToken cancellationToken) => Task.FromResult(User);
    public Task<UserProfile> UpdateProfileAsync(Guid userId, UpdateProfileRequest request, CancellationToken cancellationToken) => Task.FromResult(User with { DisplayName = request.DisplayName });
}

// Added to the application only by the test factory above, never to the production API.
[ApiController]
[Route("_tests/admin")]
[Authorize(Policy = "Admin")]
public sealed class AuthorizationProbeController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok();
}
