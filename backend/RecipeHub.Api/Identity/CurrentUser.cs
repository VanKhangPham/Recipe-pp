using System.Security.Claims;
using RecipeHub.Application.Identity;

namespace RecipeHub.Api.Identity;

internal static class CurrentUser
{
    public static Guid? OptionalId(this ClaimsPrincipal user) => Guid.TryParse(user.FindFirst("sub")?.Value, out var id) ? id : null;
    public static Guid RequiredId(this ClaimsPrincipal user) => user.OptionalId() ?? throw new AuthException(AuthError.Unauthorized, "Invalid access token.");
}
