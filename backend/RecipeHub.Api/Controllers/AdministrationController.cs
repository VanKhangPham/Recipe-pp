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
    [HttpGet("users")]
    public Task<PageResult<AdminUserDto>> Users([FromQuery] PageQuery page, CancellationToken ct) => administration.UsersAsync(page, ct);
    [HttpPatch("users/{id:guid}/status")]
    public Task<AdminUserDto> Status(Guid id, UserStatusWrite request, CancellationToken ct) => administration.SetUserStatusAsync(User.RequiredId(), id, request.IsLocked, ct);
    [HttpGet("reviews")]
    public Task<PageResult<ReviewDto>> Reviews([FromQuery] string? moderationStatus, [FromQuery] PageQuery page, CancellationToken ct) => administration.ReviewsAsync(moderationStatus, page, ct);
    [HttpPatch("reviews/{id:guid}/moderation")]
    public Task<ReviewDto> Moderate(Guid id, ModerationWrite request, CancellationToken ct) => administration.ModerateAsync(User.RequiredId(), id, request.Status, ct);
    [HttpGet("analytics")]
    public Task<AnalyticsDto> Analytics([FromQuery] DateTimeOffset? from, [FromQuery] DateTimeOffset? to, CancellationToken ct) => administration.AnalyticsAsync(from, to, ct);
}
