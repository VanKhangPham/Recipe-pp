using Microsoft.EntityFrameworkCore;
using RecipeHub.Application.Features;
using RecipeHub.Application.Recipes;
using RecipeHub.Domain.Features;
using RecipeHub.Domain.Recipes;
using RecipeHub.Infrastructure.Persistence;
using RecipeHub.Infrastructure.Recipes;
using static RecipeHub.Infrastructure.Recipes.RecipeService;

namespace RecipeHub.Infrastructure.Features;

public sealed class PlanningService(RecipeHubDbContext db, RecipeService recipes, TimeProvider clock) : IPlanningService
{
    public async Task<MealPlanDto> PlanAsync(Guid userId, DateOnly weekStart, CancellationToken ct)
    {
        CheckWeek(weekStart);
        var plan = await db.Set<MealPlan>().AsNoTracking().SingleOrDefaultAsync(x => x.UserId == userId && x.WeekStart == weekStart, ct) ?? throw Missing();
        return new(plan.Id, plan.WeekStart, await (from item in db.Set<MealPlanItem>() join recipe in db.Recipes on item.RecipeId equals recipe.Id
            where item.MealPlanId == plan.Id orderby item.PlannedDate, item.MealType, item.Id
            select new MealItemDto(item.Id, recipe.Id, recipe.Title, item.PlannedDate, item.MealType, item.Servings)).ToArrayAsync(ct));
    }
    public async Task<MealPlanDto> CreatePlanAsync(Guid userId, PlanWrite request, CancellationToken ct)
    {
        CheckWeek(request.WeekStart);
        var plan = new MealPlan { UserId = userId, WeekStart = request.WeekStart, CreatedAt = clock.GetUtcNow(), UpdatedAt = clock.GetUtcNow() };
        db.Add(plan); await recipes.SaveAsync(ct); return new(plan.Id, plan.WeekStart, []);
    }
    private static void CheckWeek(DateOnly date)
    {
        if (date.DayOfWeek != DayOfWeek.Monday || date.Year is < 2000 or > 2100) throw Invalid("weekStart must be a Monday in 2000..2100.");
    }
    private async Task<MealPlan> LockPlan(Guid userId, Guid planId, CancellationToken ct) =>
        await db.Set<MealPlan>().FromSqlInterpolated($"SELECT * FROM \"MealPlans\" WHERE \"Id\" = {planId} AND \"UserId\" = {userId} FOR UPDATE")
            .SingleOrDefaultAsync(ct) ?? throw Missing();

    public async Task<MealItemDto> SaveItemAsync(Guid userId, Guid planId, Guid? itemId, MealItemWrite request, CancellationToken ct)
    {
        await using var transaction = await db.Database.BeginTransactionAsync(ct);
        var plan = await LockPlan(userId, planId, ct);
        if (request.PlannedDate < plan.WeekStart || request.PlannedDate > plan.WeekStart.AddDays(6)) throw Invalid("Meal date must be within the plan week.");
        var recipe = await db.Recipes.AsNoTracking().SingleOrDefaultAsync(x => x.Id == request.RecipeId && x.Status == "Published", ct) ?? throw Missing();
        var item = itemId.HasValue ? await db.Set<MealPlanItem>().SingleOrDefaultAsync(x => x.Id == itemId && x.MealPlanId == planId, ct) ?? throw Missing() : new MealPlanItem { MealPlanId = planId };
        if (!itemId.HasValue)
        {
            if (await db.Set<MealPlanItem>().CountAsync(x => x.MealPlanId == planId, ct) >= 100) throw Invalid("A weekly plan supports at most 100 recipe entries.");
            db.Add(item);
        }
        item.RecipeId = request.RecipeId; item.PlannedDate = request.PlannedDate; item.MealType = request.MealType; item.Servings = request.Servings;
        plan.UpdatedAt = clock.GetUtcNow(); await recipes.SaveAsync(ct); await transaction.CommitAsync(ct);
        return new(item.Id, recipe.Id, recipe.Title, item.PlannedDate, item.MealType, item.Servings);
    }
    public async Task DeleteItemAsync(Guid userId, Guid planId, Guid itemId, CancellationToken ct)
    {
        await using var transaction = await db.Database.BeginTransactionAsync(ct);
        var plan = await LockPlan(userId, planId, ct);
        var item = await db.Set<MealPlanItem>().SingleOrDefaultAsync(x => x.Id == itemId && x.MealPlanId == planId, ct) ?? throw Missing();
        db.Remove(item); plan.UpdatedAt = clock.GetUtcNow(); await recipes.SaveAsync(ct); await transaction.CommitAsync(ct);
    }
    public async Task<(ShoppingListDto List, bool Created)> GenerateAsync(Guid userId, Guid planId, CancellationToken ct)
    {
        await using var transaction = await db.Database.BeginTransactionAsync(ct);
        var plan = await LockPlan(userId, planId, ct);
        var existing = await db.Set<ShoppingList>().Where(x => x.MealPlanId == planId && x.UserId == userId).Select(x => (Guid?)x.Id).SingleOrDefaultAsync(ct);
        if (existing.HasValue)
        {
            await transaction.CommitAsync(ct); return (await ListAsync(userId, existing.Value, ct), false);
        }
        var rows = await (from item in db.Set<MealPlanItem>() join recipe in db.Recipes on item.RecipeId equals recipe.Id
            join ingredient in db.Set<RecipeIngredient>() on recipe.Id equals ingredient.RecipeId
            where item.MealPlanId == planId
            select new { ingredient.IngredientId, ingredient.Unit, Quantity = ingredient.Quantity * item.Servings / recipe.Servings }).ToListAsync(ct);
        if (rows.Count == 0) throw Invalid("Cannot generate a shopping list from an empty meal plan.");
        var list = new ShoppingList { UserId = userId, MealPlanId = planId, Name = $"Week {plan.WeekStart:yyyy-MM-dd}", CreatedAt = clock.GetUtcNow(), UpdatedAt = clock.GetUtcNow() };
        foreach (var group in rows.GroupBy(x => new { x.IngredientId, x.Unit }))
        {
            var quantity = decimal.Ceiling(group.Sum(x => x.Quantity) * 1000m) / 1000m;
            if (quantity > 999999999.999m) throw Invalid("Aggregated shopping quantity exceeds supported size.");
            list.Items.Add(new ShoppingListItem { ShoppingListId = list.Id, IngredientId = group.Key.IngredientId, Unit = group.Key.Unit, Quantity = quantity });
        }
        db.Add(list); await recipes.SaveAsync(ct); await transaction.CommitAsync(ct);
        return (await ListAsync(userId, list.Id, ct), true);
    }
    public async Task<PageResult<ShoppingSummary>> ListsAsync(Guid userId, PageQuery page, CancellationToken ct)
    {
        var query = db.Set<ShoppingList>().Where(x => x.UserId == userId);
        return new(await query.OrderByDescending(x => x.UpdatedAt).ThenBy(x => x.Id).Skip((page.Page - 1) * page.PageSize).Take(page.PageSize)
            .Select(x => new ShoppingSummary(x.Id, x.Name, x.MealPlanId, x.UpdatedAt)).ToListAsync(ct), page.Page, page.PageSize, await query.CountAsync(ct));
    }
    public async Task<ShoppingListDto> ListAsync(Guid userId, Guid id, CancellationToken ct)
    {
        var list = await db.Set<ShoppingList>().AsNoTracking().SingleOrDefaultAsync(x => x.Id == id && x.UserId == userId, ct) ?? throw Missing();
        var items = await ItemDtos(db.Set<ShoppingListItem>().Where(x => x.ShoppingListId == id)).ToArrayAsync(ct);
        return new(list.Id, list.Name, list.MealPlanId, items);
    }
    private IQueryable<ShoppingItemDto> ItemDtos(IQueryable<ShoppingListItem> query) => from item in query
        join ingredient in db.Ingredients on item.IngredientId equals ingredient.Id
        orderby ingredient.Name, item.Unit, item.Id select new ShoppingItemDto(item.Id, ingredient.Id, ingredient.Name, item.Quantity, item.Unit, item.IsPurchased, item.Note);
    public async Task<ShoppingItemDto> PatchItemAsync(Guid userId, Guid listId, Guid itemId, ShoppingPatch request, CancellationToken ct)
    {
        if (request.Quantity is null && request.IsPurchased is null && request.Note is null) throw Invalid("At least one field is required.");
        var list = await db.Set<ShoppingList>().SingleOrDefaultAsync(x => x.Id == listId && x.UserId == userId, ct) ?? throw Missing();
        var item = await db.Set<ShoppingListItem>().SingleOrDefaultAsync(x => x.Id == itemId && x.ShoppingListId == listId, ct) ?? throw Missing();
        if (request.Quantity.HasValue)
        {
            if (decimal.Round(request.Quantity.Value, 3) != request.Quantity) throw Invalid("Quantity supports at most 3 decimal places.");
            item.Quantity = request.Quantity.Value; item.IsManuallyEdited = true;
        }
        if (request.IsPurchased.HasValue) item.IsPurchased = request.IsPurchased.Value;
        if (request.Note is not null) item.Note = request.Note.Trim();
        list.UpdatedAt = clock.GetUtcNow(); await recipes.SaveAsync(ct);
        return await ItemDtos(db.Set<ShoppingListItem>().Where(x => x.Id == itemId)).SingleAsync(ct);
    }
}

