using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecipeHub.Api.Identity;
using RecipeHub.Application.Features;
using RecipeHub.Application.Recipes;

namespace RecipeHub.Api.Controllers;

[ApiController, Authorize(Policy = "Admin"), ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
[Route("api/v1/admin")]
public sealed class AdministrationController(IAdministrationService administration) : ControllerBase
{
    [HttpGet("dataset/{recipeId:guid}/review")]
    public async Task<ActionResult<DatasetReviewDto>> GetDatasetReview(Guid recipeId, CancellationToken ct)
    {
        var review = await administration.GetDatasetReviewAsync(recipeId, ct);
        return review is null ? NoContent() : Ok(review);
    }

    [HttpPatch("dataset/{recipeId:guid}/review")]
    public Task<DatasetReviewDto> ReviewDataset(Guid recipeId, DatasetReviewWrite request, CancellationToken ct) =>
        administration.ReviewDatasetAsync(User.RequiredId(), recipeId, request, ct);
    [HttpGet("users")]
    public Task<PageResult<AdminUserDto>> Users([FromQuery] PageQuery page, CancellationToken ct) => administration.UsersAsync(page, ct);
    [HttpPatch("users/{id:guid}/status")]
    public Task<AdminUserDto> Status(Guid id, UserStatusWrite request, CancellationToken ct) => administration.SetUserStatusAsync(User.RequiredId(), id, request.IsLocked, ct);
    [HttpGet("reviews")]
    public Task<PageResult<ReviewDto>> Reviews([FromQuery] string? moderationStatus, [FromQuery] PageQuery page, CancellationToken ct) => administration.ReviewsAsync(moderationStatus, page, ct);
    [HttpPatch("users/{id:guid}/admin")]
    public Task<AdminUserDto> AdminRole(Guid id, UserAdminWrite request, CancellationToken ct) => administration.SetUserAdminAsync(User.RequiredId(), id, request.IsAdmin, ct);
    [HttpPatch("reviews/{id:guid}/moderation")]
    public Task<ReviewDto> Moderate(Guid id, ModerationWrite request, CancellationToken ct) => administration.ModerateAsync(User.RequiredId(), id, request.Status, ct);
    [HttpGet("analytics")]
    public async Task<ActionResult<AnalyticsDto>> Analytics([FromQuery] DateTimeOffset? from, [FromQuery] DateTimeOffset? to, CancellationToken ct)
    {
        try
        {
            return await administration.AnalyticsAsync(from, to, ct);
        }
        catch (OperationCanceledException) when (HttpContext.RequestAborted.IsCancellationRequested)
        {
            return StatusCode(StatusCodes.Status499ClientClosedRequest);
        }
    }
}
