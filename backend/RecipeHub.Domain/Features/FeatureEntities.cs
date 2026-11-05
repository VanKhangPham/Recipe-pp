namespace RecipeHub.Domain.Features;

public sealed class Tag
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
}
public sealed class RecipeTag
{
    public Guid RecipeId { get; set; }
    public Guid TagId { get; set; }
}
public sealed class NutritionFacts
{
    public Guid RecipeId { get; set; }
    public decimal? Calories { get; set; }
    public decimal? ProteinGrams { get; set; }
    public decimal? CarbsGrams { get; set; }
    public decimal? FatGrams { get; set; }
    public string Source { get; set; } = string.Empty;
}
public sealed class Favorite
{
    public Guid UserId { get; set; }
    public Guid RecipeId { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
public sealed class Review
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public Guid RecipeId { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public string ModerationStatus { get; set; } = "Visible";
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
}
public sealed class RecipeView
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid? UserId { get; set; }
    public Guid RecipeId { get; set; }
    public DateTimeOffset ViewedAt { get; set; } = DateTimeOffset.UtcNow;
}
public sealed class UserPreference
{
    public Guid UserId { get; set; }
    public string[] DietaryPreferences { get; set; } = [];
    public string[] Allergens { get; set; } = [];
    public int? PreferredMaxCookingMinutes { get; set; }
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
}
public sealed class MealPlan
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public DateOnly WeekStart { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
    public List<MealPlanItem> Items { get; set; } = [];
}
public sealed class MealPlanItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid MealPlanId { get; set; }
    public Guid RecipeId { get; set; }
    public DateOnly PlannedDate { get; set; }
    public string MealType { get; set; } = string.Empty;
    public int Servings { get; set; }
}
public sealed class ShoppingList
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public Guid? MealPlanId { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
    public List<ShoppingListItem> Items { get; set; } = [];
}
public sealed class ShoppingListItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ShoppingListId { get; set; }
    public Guid IngredientId { get; set; }
    public decimal Quantity { get; set; }
    public string Unit { get; set; } = string.Empty;
    public bool IsPurchased { get; set; }
    public bool IsManuallyEdited { get; set; }
    public string? Note { get; set; }
}
public sealed class AuditLog
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid? ActorUserId { get; set; }
    public string Action { get; set; } = string.Empty;
    public string EntityType { get; set; } = string.Empty;
    public string EntityId { get; set; } = string.Empty;
    public DateTimeOffset OccurredAt { get; set; } = DateTimeOffset.UtcNow;
}
