using System.ComponentModel.DataAnnotations;
using RecipeHub.Application.Recipes;

namespace RecipeHub.Application.Features;

public sealed record PlanWrite(DateOnly WeekStart);
public sealed record MealItemWrite(Guid RecipeId, DateOnly PlannedDate,
    [Required, RegularExpression("^(Breakfast|Lunch|Dinner|Snack)$")] string MealType, [Range(1, 100)] int Servings);
public sealed record MealItemDto(Guid Id, Guid RecipeId, string RecipeTitle, DateOnly PlannedDate, string MealType, int Servings);
public sealed record MealPlanDto(Guid Id, DateOnly WeekStart, MealItemDto[] Items);
public sealed record ShoppingItemDto(Guid Id, Guid IngredientId, string IngredientName, decimal Quantity, string Unit, bool IsPurchased, string? Note);
public sealed record ShoppingListDto(Guid Id, string Name, Guid? MealPlanId, ShoppingItemDto[] Items);
public sealed record ShoppingSummary(Guid Id, string Name, Guid? MealPlanId, DateTimeOffset UpdatedAt);
public sealed record ShoppingPatch([Range(typeof(decimal), "0.001", "999999999.999")] decimal? Quantity, bool? IsPurchased, [MaxLength(300)] string? Note);
public interface IPlanningService
{
    Task<MealPlanDto> PlanAsync(Guid userId, DateOnly weekStart, CancellationToken ct);
    Task<MealPlanDto> CreatePlanAsync(Guid userId, PlanWrite request, CancellationToken ct);
    Task<MealItemDto> SaveItemAsync(Guid userId, Guid planId, Guid? itemId, MealItemWrite request, CancellationToken ct);
    Task DeleteItemAsync(Guid userId, Guid planId, Guid itemId, CancellationToken ct);
    Task<(ShoppingListDto List, bool Created)> GenerateAsync(Guid userId, Guid planId, CancellationToken ct);
    Task<PageResult<ShoppingSummary>> ListsAsync(Guid userId, PageQuery page, CancellationToken ct);
    Task<ShoppingListDto> ListAsync(Guid userId, Guid id, CancellationToken ct);
    Task<ShoppingItemDto> PatchItemAsync(Guid userId, Guid listId, Guid itemId, ShoppingPatch request, CancellationToken ct);
}
