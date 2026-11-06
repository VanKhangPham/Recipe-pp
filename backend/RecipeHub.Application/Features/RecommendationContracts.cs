using System.ComponentModel.DataAnnotations;
using RecipeHub.Application.Recipes;

namespace RecipeHub.Application.Features;

public sealed class RecommendationQuery
{
    [MaxLength(20)] public Guid[] IngredientIds { get; set; } = [];
    public Guid? CategoryId { get; set; }
    [Range(1, 2880)] public int? MaxTotalMinutes { get; set; }
    [Range(1, 50)] public int Limit { get; set; } = 10;
}
public sealed record RecommendationDto(RecipeSummary Recipe, double Score, string[] Reasons);
public sealed record RecommendationSignals(double IngredientSimilarity, double CategorySimilarity,
    double PreferenceSimilarity, double Popularity, double TimeCompatibility,
    bool HasIngredients, bool HasCategories, bool HasPreferences, bool HasTime);
public static class RecommendationScoring
{
    public static double Score(RecommendationSignals input)
    {
        var denominator = .1 + (input.HasIngredients ? .45 : 0) + (input.HasCategories ? .2 : 0)
            + (input.HasPreferences ? .15 : 0) + (input.HasTime ? .1 : 0);
        var numerator = .1 * Math.Clamp(input.Popularity, 0, 1)
            + (input.HasIngredients ? .45 * Math.Clamp(input.IngredientSimilarity, 0, 1) : 0)
            + (input.HasCategories ? .2 * Math.Clamp(input.CategorySimilarity, 0, 1) : 0)
            + (input.HasPreferences ? .15 * Math.Clamp(input.PreferenceSimilarity, 0, 1) : 0)
            + (input.HasTime ? .1 * Math.Clamp(input.TimeCompatibility, 0, 1) : 0);
        return Math.Round(numerator / denominator, 6);
    }
    public static double Jaccard(IEnumerable<Guid> first, IEnumerable<Guid> second)
    {
        var a = first.ToHashSet(); var b = second.ToHashSet(); var union = a.Union(b).Count();
        return union == 0 ? 0 : (double)a.Intersect(b).Count() / union;
    }
}
public interface IRecommendationService
{
    Task<RecommendationDto[]> RecommendAsync(RecommendationQuery query, Guid? userId, Guid? similarTo, CancellationToken ct);
}
