using Microsoft.Extensions.DependencyInjection;
using RecipeHub.Application.Features;
using RecipeHub.Application.Identity;
using RecipeHub.Application.Recipes;
using Xunit;

namespace RecipeHub.Tests;

[Collection("Postgres auth")]
public sealed class MealWorkflowTests(PostgresAuthFixture fixture) : IClassFixture<PostgresAuthFixture>
{
    [PostgresFact]
    public async Task PublishedRecipeFeedsPrivatePlanAndScaledShoppingSnapshot()
    {
        var owner = await fixture.WithService(a => a.RegisterAsync(PostgresAuthFixture.NewUser(), default));
        var other = await fixture.WithService(a => a.RegisterAsync(PostgresAuthFixture.NewUser(), default));
        using var scope = fixture.Factory.Services.CreateScope();
        var recipes = scope.ServiceProvider.GetRequiredService<IRecipeService>();
        var plans = scope.ServiceProvider.GetRequiredService<IPlanningService>();
        var rice = await recipes.SaveIngredientAsync(null, new($"Rice-{Guid.NewGuid():N}", "g"), default);
        var dish = await recipes.SaveAsync(null, new("Rice bowl", "Steamed rice", 2, 5, 20, "Easy", "Published",
            [new(rice.Id, 100, "g", null, 1)], [new(1, "Steam rice", 20)], [], [], []), owner.Id, false, default);
        var date = new DateOnly(2026, 11, 2);
        Assert.Null(await plans.PlanAsync(owner.Id, date, default));
        var plan = await plans.CreatePlanAsync(owner.Id, new(date), default);
        Assert.Equal(plan.Id, (await plans.PlanAsync(owner.Id, date, default))!.Id);
        Assert.Null(await plans.PlanAsync(other.Id, date, default));
        Assert.Null(await plans.PlanAsync(owner.Id, date.AddDays(7), default));
        var meal = new MealItemWrite(dish.Summary.Id, date, "Lunch", 3);
        var savedMeal = await plans.SaveItemAsync(owner.Id, plan.Id, null, meal, default);
        var denied = await Assert.ThrowsAsync<AuthException>(() => plans.SaveItemAsync(other.Id, plan.Id, null, meal, default));
        Assert.Equal(AuthError.NotFound, denied.Error);
        var first = await plans.GenerateAsync(owner.Id, plan.Id, default);
        Assert.True(first.Created);
        Assert.Equal(150m, Assert.Single(first.List.Items).Quantity);
        var again = await plans.GenerateAsync(owner.Id, plan.Id, default);
        Assert.False(again.Created);
        Assert.Equal(first.List.Id, again.List.Id);
        var ingredient = Assert.Single(first.List.Items);
        await plans.PatchItemAsync(owner.Id, first.List.Id, ingredient.Id, new(null, true, "Buy fresh"), default);
        var unchanged = await plans.RefreshShoppingAsync(owner.Id, plan.Id, default);
        Assert.Equal(ingredient.Id, Assert.Single(unchanged.Items).Id);
        Assert.True(unchanged.Items[0].IsPurchased);
        await plans.SaveItemAsync(owner.Id, plan.Id, savedMeal.Id, meal with { Servings = 6 }, default);
        var refreshed = await plans.RefreshShoppingAsync(owner.Id, plan.Id, default);
        Assert.Equal(first.List.Id, refreshed.Id);
        Assert.Equal(300m, Assert.Single(refreshed.Items).Quantity);
        Assert.False(refreshed.Items[0].IsPurchased);
        Assert.Equal("Buy fresh", refreshed.Items[0].Note);
        await plans.PatchItemAsync(owner.Id, first.List.Id, ingredient.Id, new(250m, true, null), default);
        await plans.SaveItemAsync(owner.Id, plan.Id, savedMeal.Id, meal with { Servings = 8 }, default);
        var manual = await plans.RefreshShoppingAsync(owner.Id, plan.Id, default);
        Assert.Equal(250m, Assert.Single(manual.Items).Quantity);
        Assert.True(manual.Items[0].IsPurchased);
        denied = await Assert.ThrowsAsync<AuthException>(() => plans.RefreshShoppingAsync(other.Id, plan.Id, default));
        Assert.Equal(AuthError.NotFound, denied.Error);
        await plans.DeleteItemAsync(owner.Id, plan.Id, savedMeal.Id, default);
        Assert.Empty((await plans.RefreshShoppingAsync(owner.Id, plan.Id, default)).Items);
        denied = await Assert.ThrowsAsync<AuthException>(() => plans.ListAsync(other.Id, first.List.Id, default));
        Assert.Equal(AuthError.NotFound, denied.Error);
    }
}

