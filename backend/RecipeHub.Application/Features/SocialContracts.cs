using System.ComponentModel.DataAnnotations;
using RecipeHub.Application.Recipes;

namespace RecipeHub.Application.Features;

public sealed record ReviewWrite([Range(1, 5)] int Rating, [Required, MaxLength(2000)] string Comment);
public sealed record ReviewDto(Guid Id, Guid RecipeId, PublicAuthor Author, int Rating, string Comment,
    DateTimeOffset CreatedAt, DateTimeOffset UpdatedAt, string? ModerationStatus);
public sealed record PreferencesWrite([Required, MaxLength(20)] string[] DietaryPreferences,
    [Required, MaxLength(20)] string[] Allergens, [Range(1, 2880)] int? PreferredMaxCookingMinutes);
public interface ISocialService
{
    Task<PageResult<RecipeSummary>> FavoritesAsync(Guid userId, PageQuery page, CancellationToken ct);
    Task FavoriteAsync(Guid userId, Guid recipeId, bool add, CancellationToken ct);
    Task<PageResult<ReviewDto>> ReviewsAsync(Guid recipeId, PageQuery page, CancellationToken ct);
    Task<ReviewDto> ReviewAsync(Guid? id, Guid? recipeId, Guid userId, bool admin, ReviewWrite request, CancellationToken ct);
    Task DeleteReviewAsync(Guid id, Guid userId, bool admin, CancellationToken ct);
    Task ViewAsync(Guid recipeId, Guid? userId, CancellationToken ct);
    Task<PreferencesWrite> PreferencesAsync(Guid userId, CancellationToken ct);
    Task<PreferencesWrite> UpdatePreferencesAsync(Guid userId, PreferencesWrite request, CancellationToken ct);
}
