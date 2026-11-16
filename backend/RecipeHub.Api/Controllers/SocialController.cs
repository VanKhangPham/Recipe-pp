using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using RecipeHub.Api.Identity;
using RecipeHub.Application.Features;
using RecipeHub.Application.Recipes;

namespace RecipeHub.Api.Controllers;

[ApiController]
[Route("api/v1")]
public sealed class SocialController(ISocialService social) : ControllerBase
{
    [HttpGet("users/me/favorites"), Authorize, ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
    public Task<PageResult<RecipeSummary>> Favorites([FromQuery] PageQuery page, CancellationToken ct) => social.FavoritesAsync(User.RequiredId(), page, ct);
    [HttpPut("users/me/favorites/{id:guid}"), Authorize]
    public async Task<IActionResult> AddFavorite(Guid id, CancellationToken ct) { await social.FavoriteAsync(User.RequiredId(), id, true, ct); return NoContent(); }
    [HttpDelete("users/me/favorites/{id:guid}"), Authorize]
    public async Task<IActionResult> RemoveFavorite(Guid id, CancellationToken ct) { await social.FavoriteAsync(User.RequiredId(), id, false, ct); return NoContent(); }
    [HttpGet("recipes/{id:guid}/reviews")]
    public Task<PageResult<ReviewDto>> Reviews(Guid id, [FromQuery] PageQuery page, CancellationToken ct) => social.ReviewsAsync(id, page, ct);
    [HttpPost("recipes/{id:guid}/reviews"), Authorize]
    public async Task<ActionResult<ReviewDto>> AddReview(Guid id, ReviewWrite request, CancellationToken ct)
    {
        var review = await social.ReviewAsync(null, id, User.RequiredId(), false, request, ct); return Created($"/api/v1/reviews/{review.Id}", review);
    }
    [HttpPut("reviews/{id:guid}"), Authorize]
    public Task<ReviewDto> EditReview(Guid id, ReviewWrite request, CancellationToken ct) => social.ReviewAsync(id, null, User.RequiredId(), User.IsInRole("Admin"), request, ct);
    [HttpDelete("reviews/{id:guid}"), Authorize]
    public async Task<IActionResult> DeleteReview(Guid id, CancellationToken ct) { await social.DeleteReviewAsync(id, User.RequiredId(), User.IsInRole("Admin"), ct); return NoContent(); }
    [HttpPost("recipes/{id:guid}/views"), EnableRateLimiting("views")]
    public async Task<IActionResult> View(Guid id, CancellationToken ct) { await social.ViewAsync(id, User.OptionalId(), ct); return NoContent(); }
    [HttpGet("users/me/preferences"), Authorize, ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
    public Task<PreferencesWrite> Preferences(CancellationToken ct) => social.PreferencesAsync(User.RequiredId(), ct);
    [HttpPut("users/me/preferences"), Authorize]
    public Task<PreferencesWrite> Preferences(PreferencesWrite request, CancellationToken ct) => social.UpdatePreferencesAsync(User.RequiredId(), request, ct);
}
