namespace RecipeHub.Domain.Recipes;

public sealed class Recipe
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid AuthorId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Servings { get; set; }
    public int PrepMinutes { get; set; }
    public int CookMinutes { get; set; }
    public string Difficulty { get; set; } = "Easy";
    public string Status { get; set; } = "Draft";
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? PublishedAt { get; set; }
    public List<RecipeStep> Steps { get; set; } = [];
    public List<RecipeIngredient> Ingredients { get; set; } = [];
    public List<RecipeImage> Images { get; set; } = [];
    public List<RecipeCategory> Categories { get; set; } = [];
}

public sealed class RecipeStep
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid RecipeId { get; set; }
    public int Position { get; set; }
    public string Instruction { get; set; } = string.Empty;
    public int? DurationMinutes { get; set; }
}

public sealed class Ingredient
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string NormalizedName { get; set; } = string.Empty;
    public string DefaultUnit { get; set; } = "g";
}

public sealed class RecipeIngredient
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid RecipeId { get; set; }
    public Guid IngredientId { get; set; }
    public decimal Quantity { get; set; }
    public string Unit { get; set; } = string.Empty;
    public string? Note { get; set; }
    public int Position { get; set; }
}

public sealed class RecipeImage
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid RecipeId { get; set; }
    public string Url { get; set; } = string.Empty;
    public string AltText { get; set; } = string.Empty;
    public int Position { get; set; }
}

public sealed class Category
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
}

public sealed class RecipeCategory
{
    public Guid RecipeId { get; set; }
    public Guid CategoryId { get; set; }
}
