using System.ComponentModel.DataAnnotations;
using RecipeHub.Application.Recipes;

namespace RecipeHub.Application.Features;

public sealed record AdminUserDto(Guid Id, string Email, string DisplayName, string[] Roles, bool IsLocked, DateTimeOffset CreatedAt);
public sealed record UserStatusWrite(bool IsLocked);
public sealed record ModerationWrite([Required, RegularExpression("^(Visible|Hidden)$")] string Status);
public sealed record RecipeMetric(Guid RecipeId, string Title, int Count);
public sealed record DailyActivity(DateOnly Date, int Views, int NewUsers);
public sealed record StatusCount(string Status, int Count);
public sealed record AnalyticsDto(int TotalUsers, int TotalRecipes, int ViewsInPeriod, int FavoritesInPeriod,
    RecipeMetric[] MostViewed, RecipeMetric[] MostFavorited, DailyActivity[] DailyActivity, StatusCount[] RecipeStatistics);
public interface IAdministrationService
{
    Task<PageResult<AdminUserDto>> UsersAsync(PageQuery page, CancellationToken ct);
    Task<AdminUserDto> SetUserStatusAsync(Guid actorId, Guid targetId, bool locked, CancellationToken ct);
    Task<PageResult<ReviewDto>> ReviewsAsync(string? status, PageQuery page, CancellationToken ct);
    Task<ReviewDto> ModerateAsync(Guid actorId, Guid id, string status, CancellationToken ct);
    Task<AnalyticsDto> AnalyticsAsync(DateTimeOffset? from, DateTimeOffset? to, CancellationToken ct);
    Task BootstrapAdminAsync(string email, string password, string displayName, CancellationToken ct);
}
