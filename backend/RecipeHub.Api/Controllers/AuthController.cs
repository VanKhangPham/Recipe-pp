using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using RecipeHub.Api.Identity;
using RecipeHub.Application.Identity;

namespace RecipeHub.Api.Controllers;

[ApiController]
[AllowAnonymous]
[Route("api/v1/auth")]
[EnableRateLimiting("auth")]
public sealed class AuthController(IAuthService auth, IWebHostEnvironment environment) : ControllerBase
{
    private const string RefreshCookie = "recipehub.refresh";

    [HttpGet("csrf")]
    public IActionResult Csrf([FromServices] IAntiforgery antiforgery)
    {
        Response.Headers.CacheControl = "no-store";
        return Ok(new { requestToken = antiforgery.GetAndStoreTokens(HttpContext).RequestToken });
    }

    [HttpPost("register")]
    [ServiceFilter(typeof(AuthRequestFilter))]
    public async Task<ActionResult<UserProfile>> Register(RegisterRequest request, CancellationToken cancellationToken)
    {
        Response.Headers.CacheControl = "no-store";
        var profile = await auth.RegisterAsync(request, cancellationToken);
        return Created("/api/v1/users/me", profile);
    }

    [HttpPost("login")]
    [ServiceFilter(typeof(AuthRequestFilter))]
    public async Task<ActionResult<TokenResponse>> Login(LoginRequest request, CancellationToken cancellationToken) =>
        CompleteSession(await auth.LoginAsync(request, cancellationToken));

    [HttpPost("refresh")]
    [ServiceFilter(typeof(AuthRequestFilter))]
    public async Task<ActionResult<TokenResponse>> Refresh(CancellationToken cancellationToken)
    {
        try
        {
            var raw = Request.Cookies[RefreshCookie];
            if (string.IsNullOrEmpty(raw)) throw new AuthException(AuthError.Unauthorized, "Invalid credentials or session.");
            return CompleteSession(await auth.RefreshAsync(raw, cancellationToken));
        }
        catch (AuthException exception) when (exception.Error == AuthError.Unauthorized)
        {
            Response.Cookies.Delete(RefreshCookie, CookieOptions());
            throw;
        }
    }

    [HttpPost("logout")]
    [ServiceFilter(typeof(AuthRequestFilter))]
    public async Task<IActionResult> Logout(CancellationToken cancellationToken)
    {
        await auth.LogoutAsync(Request.Cookies[RefreshCookie], cancellationToken);
        Response.Cookies.Delete(RefreshCookie, CookieOptions());
        Response.Headers.CacheControl = "no-store";
        return NoContent();
    }

    private ActionResult<TokenResponse> CompleteSession(AuthSession session)
    {
        Response.Headers.CacheControl = "no-store";
        var options = CookieOptions();
        options.Expires = session.RefreshExpiresAt;
        Response.Cookies.Append(RefreshCookie, session.RefreshToken, options);
        return Ok(new TokenResponse(session.AccessToken.Value, "Bearer", session.AccessToken.ExpiresIn, session.User));
    }

    private CookieOptions CookieOptions() => new()
    {
        HttpOnly = true, Secure = !environment.IsDevelopment() || Request.IsHttps,
        SameSite = SameSiteMode.Lax, Path = "/api/v1/auth", IsEssential = true
    };
}
