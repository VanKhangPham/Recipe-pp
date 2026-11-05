using Microsoft.EntityFrameworkCore;
using RecipeHub.Application.Features;
using RecipeHub.Application.Recipes;
using RecipeHub.Domain.Features;
using RecipeHub.Infrastructure.Persistence;
using RecipeHub.Infrastructure.Recipes;
using static RecipeHub.Infrastructure.Recipes.RecipeService;

namespace RecipeHub.Infrastructure.Features;

public sealed class SocialService(RecipeHubDbContext db, RecipeService recipes, TimeProvider clock) : ISocialService
{
    public async Task<PageResult<RecipeSummary>> FavoritesAsync(Guid userId, PageQuery page, CancellationToken ct)
    {
        var query = from recipe in db.Recipes join favorite in db.Set<Favorite>() on recipe.Id equals favorite.RecipeId
            where favorite.UserId == userId && recipe.Status == "Published" orderby favorite.CreatedAt descending, recipe.Id select recipe;
        var total = await query.CountAsync(ct);
        var result = await query.Skip((page.Page - 1) * page.PageSize).Take(page.PageSize).Select(recipes.Summary(false)).ToListAsync(ct);
        return new(result, page.Page, page.PageSize, total);
    }
    public async Task FavoriteAsync(Guid userId, Guid recipeId, bool add, CancellationToken ct)
    {
        if (add)
        {
            if (!await db.Recipes.AnyAsync(x => x.Id == recipeId && x.Status == "Published", ct)) throw Missing();
            await db.Database.ExecuteSqlInterpolatedAsync($"INSERT INTO \"Favorites\" (\"UserId\", \"RecipeId\", \"CreatedAt\") VALUES ({userId}, {recipeId}, {clock.GetUtcNow()}) ON CONFLICT (\"UserId\", \"RecipeId\") DO NOTHING", ct);
        }
        else await db.Set<Favorite>().Where(x => x.UserId == userId && x.RecipeId == recipeId).ExecuteDeleteAsync(ct);
    }
    private IQueryable<ReviewDto> ReviewDtos(IQueryable<Review> query, bool admin = false) =>
        from review in query join user in db.Users on review.UserId equals user.Id
        select new ReviewDto(review.Id, review.RecipeId, new PublicAuthor(user.Id, user.DisplayName), review.Rating, review.Comment,
            review.CreatedAt, review.UpdatedAt, admin ? review.ModerationStatus : null);

    public async Task<PageResult<ReviewDto>> ReviewsAsync(Guid recipeId, PageQuery page, CancellationToken ct)
    {
        if (!await db.Recipes.AnyAsync(x => x.Id == recipeId && x.Status == "Published", ct)) throw Missing();
        var query = db.Set<Review>().Where(x => x.RecipeId == recipeId && x.ModerationStatus == "Visible");
        return new(await ReviewDtos(query.OrderByDescending(x => x.CreatedAt).ThenBy(x => x.Id).Skip((page.Page - 1) * page.PageSize).Take(page.PageSize)).ToListAsync(ct),
            page.Page, page.PageSize, await query.CountAsync(ct));
    }
    public async Task<ReviewDto> ReviewAsync(Guid? id, Guid? recipeId, Guid userId, bool admin, ReviewWrite request, CancellationToken ct)
    {
        Review review;
        if (id.HasValue) review = await db.Set<Review>().SingleOrDefaultAsync(x => x.Id == id && (x.UserId == userId || admin), ct) ?? throw Missing();
        else
        {
            if (!await db.Recipes.AnyAsync(x => x.Id == recipeId && x.Status == "Published", ct)) throw Missing();
            review = new Review { UserId = userId, RecipeId = recipeId!.Value, CreatedAt = clock.GetUtcNow() };
            db.Add(review);
        }
        review.Rating = request.Rating; review.Comment = request.Comment.Trim(); review.UpdatedAt = clock.GetUtcNow();
        await recipes.SaveAsync(ct);
        return await ReviewDtos(db.Set<Review>().Where(x => x.Id == review.Id)).SingleAsync(ct);
    }
    public async Task DeleteReviewAsync(Guid id, Guid userId, bool admin, CancellationToken ct)
    {
        var review = await db.Set<Review>().SingleOrDefaultAsync(x => x.Id == id && (x.UserId == userId || admin), ct) ?? throw Missing();
        db.Remove(review); await recipes.SaveAsync(ct);
    }
    public async Task ViewAsync(Guid recipeId, Guid? userId, CancellationToken ct)
    {
        if (!await db.Recipes.AnyAsync(x => x.Id == recipeId && x.Status == "Published", ct)) throw Missing();
        if (userId.HasValue && await db.Set<RecipeView>().AnyAsync(x => x.UserId == userId && x.RecipeId == recipeId && x.ViewedAt > clock.GetUtcNow().AddMinutes(-15), ct)) return;
        db.Add(new RecipeView { RecipeId = recipeId, UserId = userId, ViewedAt = clock.GetUtcNow() }); await recipes.SaveAsync(ct);
    }
    public async Task<PreferencesWrite> PreferencesAsync(Guid userId, CancellationToken ct)
    {
        var preferences = await db.Set<UserPreference>().FindAsync([userId], ct);
        return preferences is null ? new([], [], null) : new(preferences.DietaryPreferences, preferences.Allergens, preferences.PreferredMaxCookingMinutes);
    }
    public async Task<PreferencesWrite> UpdatePreferencesAsync(Guid userId, PreferencesWrite request, CancellationToken ct)
    {
        if (request.DietaryPreferences.Concat(request.Allergens).Any(x => string.IsNullOrWhiteSpace(x) || x.Length > 100)) throw Invalid("Preference values must contain 1..100 characters.");
        var preferences = await db.Set<UserPreference>().FindAsync([userId], ct);
        if (preferences is null) { preferences = new UserPreference { UserId = userId }; db.Add(preferences); }
        preferences.DietaryPreferences = request.DietaryPreferences.Select(x => x.Trim().ToLowerInvariant()).Distinct().ToArray();
        preferences.Allergens = request.Allergens.Select(x => x.Trim().ToLowerInvariant()).Distinct().ToArray();
        preferences.PreferredMaxCookingMinutes = request.PreferredMaxCookingMinutes; preferences.UpdatedAt = clock.GetUtcNow();
        await recipes.SaveAsync(ct); return new(preferences.DietaryPreferences, preferences.Allergens, preferences.PreferredMaxCookingMinutes);
    }
}

