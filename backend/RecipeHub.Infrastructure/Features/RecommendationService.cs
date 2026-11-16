using Microsoft.EntityFrameworkCore;
using RecipeHub.Application.Features;
using RecipeHub.Domain.Features;
using RecipeHub.Domain.Recipes;
using RecipeHub.Infrastructure.Persistence;
using RecipeHub.Infrastructure.Recipes;
using static RecipeHub.Infrastructure.Recipes.RecipeService;

namespace RecipeHub.Infrastructure.Features;

public sealed class RecommendationService(RecipeHubDbContext db, RecipeService recipes) : IRecommendationService
{
    public async Task<RecommendationDto[]> RecommendAsync(RecommendationQuery query, Guid? userId, Guid? similarTo, CancellationToken ct)
    {
        if (query.Limit is < 1 or > 50) throw Invalid("limit must be in 1..50.");
        var ingredientIds = query.IngredientIds.Distinct().ToArray();
        var categories = query.CategoryId.HasValue ? new[] { query.CategoryId.Value } : [];
        Guid[] excluded = similarTo.HasValue ? [similarTo.Value] : [];
        UserPreference? preference = null;
        if (similarTo.HasValue)
        {
            if (!await db.Recipes.AnyAsync(x => x.Id == similarTo && x.Status == "Published", ct)) throw Missing();
            ingredientIds = await db.Set<RecipeIngredient>().Where(x => x.RecipeId == similarTo).Select(x => x.IngredientId).Distinct().ToArrayAsync(ct);
            categories = await db.Set<RecipeCategory>().Where(x => x.RecipeId == similarTo).Select(x => x.CategoryId).ToArrayAsync(ct);
        }
        if (userId.HasValue)
        {
            preference = await db.Set<UserPreference>().AsNoTracking().SingleOrDefaultAsync(x => x.UserId == userId, ct);
            excluded = await db.Set<Favorite>().Where(x => x.UserId == userId).OrderByDescending(x => x.CreatedAt).Take(200).Select(x => x.RecipeId).ToArrayAsync(ct);
            if (categories.Length == 0)
            {
                var viewed = await db.Set<RecipeView>().Where(x => x.UserId == userId).OrderByDescending(x => x.ViewedAt).Take(100).Select(x => x.RecipeId).ToArrayAsync(ct);
                var seeds = excluded.Concat(viewed).Distinct().ToArray();
                categories = await db.Set<RecipeCategory>().Where(x => seeds.Contains(x.RecipeId)).Select(x => x.CategoryId).Distinct().ToArrayAsync(ct);
            }
        }
        var maxTime = query.MaxTotalMinutes ?? preference?.PreferredMaxCookingMinutes;
        var source = db.Recipes.AsNoTracking().Where(x => x.Status == "Published" && !excluded.Contains(x.Id));
        if (maxTime.HasValue) source = source.Where(x => x.PrepMinutes + x.CookMinutes <= maxTime);
        // Dietary/allergen text is a ranking/filter hint, not a certified food-safety guarantee.
        var allergens = preference?.Allergens ?? [];
        if (allergens.Length > 0) source = source.Where(recipe => !recipe.Ingredients.Any(item => db.Ingredients.Any(i => i.Id == item.IngredientId && allergens.Contains(i.NormalizedName))));
        var candidates = await source.OrderByDescending(recipe => recipe.Ingredients.Count(x => ingredientIds.Contains(x.IngredientId)))
            .ThenByDescending(recipe => recipe.Categories.Count(x => categories.Contains(x.CategoryId)))
            .ThenByDescending(recipe => db.Set<Favorite>().Count(x => x.RecipeId == recipe.Id))
            .ThenByDescending(recipe => recipe.CreatedAt).ThenBy(recipe => recipe.Id)
            .Take(500).Select(recipe => new
            {
                recipe.Id, Minutes = recipe.PrepMinutes + recipe.CookMinutes,
                Ingredients = recipe.Ingredients.Select(x => x.IngredientId).ToArray(),
                Categories = recipe.Categories.Select(x => x.CategoryId).ToArray(),
                Tags = (from link in db.Set<RecipeTag>() join tag in db.Set<Tag>() on link.TagId equals tag.Id where link.RecipeId == recipe.Id select tag.Slug).ToArray(),
                Popularity = db.Set<Favorite>().Count(x => x.RecipeId == recipe.Id) + db.Set<RecipeView>().Count(x => x.RecipeId == recipe.Id)
            }).ToListAsync(ct);
        if (candidates.Count == 0) return [];
        var maximumPopularity = Math.Max(1, candidates.Max(x => x.Popularity));
        var dietary = preference?.DietaryPreferences ?? [];
        var ranked = candidates.Select(candidate =>
        {
            var ingredient = RecommendationScoring.Jaccard(ingredientIds, candidate.Ingredients);
            var category = RecommendationScoring.Jaccard(categories, candidate.Categories);
            var match = dietary.Length == 0 ? 0 : (double)dietary.Intersect(candidate.Tags, StringComparer.OrdinalIgnoreCase).Count() / dietary.Length;
            var popularity = Math.Log(1 + candidate.Popularity) / Math.Log(1 + maximumPopularity);
            var time = maxTime.HasValue ? 1 - (double)candidate.Minutes / maxTime.Value : 0;
            var score = RecommendationScoring.Score(new(ingredient, category, match, popularity, time,
                ingredientIds.Length > 0, categories.Length > 0, dietary.Length > 0, maxTime.HasValue));
            var reasons = new List<string>();
            if (ingredient > 0) reasons.Add("ingredient-match"); if (category > 0) reasons.Add("category-match");
            if (match > 0) reasons.Add("preference-match"); if (maxTime.HasValue) reasons.Add("within-cooking-time");
            if (reasons.Count == 0) reasons.Add("popularity-fallback");
            return new { candidate.Id, Score = score, Reasons = reasons.ToArray() };
        }).OrderByDescending(x => x.Score).ThenBy(x => x.Id).Take(query.Limit).ToArray();
        var ids = ranked.Select(x => x.Id).ToArray();
        var summaries = await db.Recipes.Where(x => ids.Contains(x.Id)).Select(recipes.Summary(false)).ToDictionaryAsync(x => x.Id, ct);
        return ranked.Select(x => new RecommendationDto(summaries[x.Id], x.Score, x.Reasons)).ToArray();
    }
}
