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
        var plan = await plans.CreatePlanAsync(owner.Id, new(date), default);
        var meal = new MealItemWrite(dish.Summary.Id, date, "Lunch", 3);
        await plans.SaveItemAsync(owner.Id, plan.Id, null, meal, default);
        var denied = await Assert.ThrowsAsync<AuthException>(() => plans.SaveItemAsync(other.Id, plan.Id, null, meal, default));
        Assert.Equal(AuthError.NotFound, denied.Error);
        var first = await plans.GenerateAsync(owner.Id, plan.Id, default);
        Assert.True(first.Created);
        Assert.Equal(150m, Assert.Single(first.List.Items).Quantity);
        var again = await plans.GenerateAsync(owner.Id, plan.Id, default);
        Assert.False(again.Created);
        Assert.Equal(first.List.Id, again.List.Id);
        denied = await Assert.ThrowsAsync<AuthException>(() => plans.ListAsync(other.Id, first.List.Id, default));
        Assert.Equal(AuthError.NotFound, denied.Error);
    }
}

