using System.ComponentModel.DataAnnotations;

namespace RecipeHub.Application.Recipes;

public sealed class PageQuery
{
    [Range(1, 1000000)] public int Page { get; set; } = 1;
    [Range(1, 100)] public int PageSize { get; set; } = 20;
}
public sealed class RecipeQuery
{
    [Range(1, 1000000)] public int Page { get; set; } = 1;
    [Range(1, 100)] public int PageSize { get; set; } = 20;
    [StringLength(200, MinimumLength = 1)] public string? Q { get; set; }
    public Guid? CategoryId { get; set; }
    public Guid? TagId { get; set; }
    [MaxLength(20)] public Guid[] IngredientIds { get; set; } = [];
    [Range(1, 2880)] public int? MaxTotalMinutes { get; set; }
    [RegularExpression("^(Easy|Medium|Hard)$")] public string? Difficulty { get; set; }
    [RegularExpression("^(newest|rating|cookingTime)$")] public string Sort { get; set; } = "newest";
    [RegularExpression("^(Draft|Published|Archived)$")] public string? Status { get; set; }
}
public sealed record PageResult<T>(IReadOnlyList<T> Items, int Page, int PageSize, int TotalCount)
{
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}
public sealed record PublicAuthor(Guid Id, string DisplayName);
public sealed record NamedItem(Guid Id, string Name, string Slug);
public sealed record IngredientDto(Guid Id, string Name, string DefaultUnit);
public sealed record IngredientWrite([Required, StringLength(150, MinimumLength = 1)] string Name,
    [Required, RegularExpression("^(g|kg|ml|l|tsp|tbsp|piece)$")] string DefaultUnit);
public sealed record NamedWrite([Required, StringLength(100, MinimumLength = 1)] string Name,
    [Required, StringLength(120, MinimumLength = 1), RegularExpression("^[a-z0-9]+(?:-[a-z0-9]+)*$")] string Slug);
public sealed record IngredientInput(Guid IngredientId, [Range(typeof(decimal), "0.001", "999999999.999")] decimal Quantity,
    [Required, RegularExpression("^(g|kg|ml|l|tsp|tbsp|piece)$")] string Unit,
    [MaxLength(300)] string? Note, [Range(1, 100)] int Position);
public sealed record StepInput([Range(1, 100)] int Position,
    [Required, StringLength(5000, MinimumLength = 1)] string Instruction, [Range(0, 1440)] int? DurationMinutes);
public sealed record ImageInput([Required, MaxLength(2048)] string Url,
    [Required, MaxLength(200)] string AltText, [Range(0, 9)] int Position);
public sealed record RecipeWrite(
    [Required, StringLength(200, MinimumLength = 1)] string Title,
    [Required, MaxLength(5000)] string Description,
    [Range(1, 100)] int Servings,
    [Range(0, 1440)] int PrepMinutes, [Range(0, 1440)] int CookMinutes,
    [Required, RegularExpression("^(Easy|Medium|Hard)$")] string Difficulty,
    [Required, RegularExpression("^(Draft|Published)$")] string Status,
    [Required, MinLength(1), MaxLength(100)] IngredientInput[] Ingredients,
    [Required, MinLength(1), MaxLength(100)] StepInput[] Steps,
    [Required, MaxLength(20)] Guid[] CategoryIds,
    [Required, MaxLength(20)] Guid[] TagIds,
    [Required, MaxLength(10)] ImageInput[] Images);
public sealed record RecipeSummary(Guid Id, string Title, string Slug, string Description, string? CoverImageUrl,
    PublicAuthor Author, int Servings, int PrepMinutes, int CookMinutes, int TotalMinutes, string Difficulty,
    double? AverageRating, int ReviewCount, NamedItem[] Categories, DateTimeOffset CreatedAt, string? Status);
public sealed record RecipeIngredientDto(Guid Id, Guid IngredientId, string IngredientName, decimal Quantity, string Unit, string? Note, int Position);
public sealed record RecipeStepDto(Guid Id, int Position, string Instruction, int? DurationMinutes);
public sealed record RecipeImageDto(Guid Id, string Url, string AltText, int Position);
public sealed record NutritionDto(decimal? Calories, decimal? ProteinGrams, decimal? CarbsGrams, decimal? FatGrams, string Source);
public sealed record RecipeDetail(RecipeSummary Summary, RecipeIngredientDto[] Ingredients, RecipeStepDto[] Steps,
    NamedItem[] Tags, RecipeImageDto[] Images, NutritionDto? Nutrition, DateTimeOffset? PublishedAt, DateTimeOffset UpdatedAt);

public interface IRecipeService
{
    Task<PageResult<RecipeSummary>> ListAsync(RecipeQuery query, Guid? ownerId, bool admin, CancellationToken ct);
    Task<RecipeDetail> GetAsync(Guid id, Guid? userId, bool admin, CancellationToken ct);
    Task<RecipeDetail> SaveAsync(Guid? id, RecipeWrite request, Guid userId, bool admin, CancellationToken ct);
    Task ArchiveAsync(Guid id, Guid userId, bool admin, CancellationToken ct);
    Task<PageResult<IngredientDto>> IngredientsAsync(string? q, PageQuery page, CancellationToken ct);
    Task<IngredientDto> GetIngredientAsync(Guid id, CancellationToken ct);
    Task<IngredientDto> SaveIngredientAsync(Guid? id, IngredientWrite request, CancellationToken ct);
    Task DeleteIngredientAsync(Guid id, CancellationToken ct);
    Task<NamedItem[]> NamesAsync(bool tags, CancellationToken ct);
    Task<NamedItem> GetNameAsync(bool tags, Guid id, CancellationToken ct);
    Task<NamedItem> SaveNameAsync(bool tags, Guid? id, NamedWrite request, CancellationToken ct);
    Task DeleteNameAsync(bool tags, Guid id, CancellationToken ct);
}
