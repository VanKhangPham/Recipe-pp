using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecipeHub.Application.Identity;

namespace RecipeHub.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/v1/users/me")]
public sealed class UsersController(IAuthService auth) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<UserProfile>> Get(CancellationToken cancellationToken)
    {
        Response.Headers.CacheControl = "no-store";
        return Ok(await auth.GetProfileAsync(UserId(), cancellationToken));
    }

    [HttpPut]
    public async Task<ActionResult<UserProfile>> Update(UpdateProfileRequest request, CancellationToken cancellationToken)
    {
        Response.Headers.CacheControl = "no-store";
        return Ok(await auth.UpdateProfileAsync(UserId(), request, cancellationToken));
    }

    private Guid UserId() => Guid.TryParse(User.FindFirst("sub")?.Value, out var id)
        ? id : throw new AuthException(AuthError.Unauthorized, "Invalid access token.");
}
