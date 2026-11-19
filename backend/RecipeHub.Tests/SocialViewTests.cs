using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using RecipeHub.Application.Features;
using RecipeHub.Application.Recipes;
using RecipeHub.Domain.Features;
using RecipeHub.Infrastructure.Persistence;
using Xunit;

namespace RecipeHub.Tests;

[Collection("Postgres auth")]
public sealed class SocialViewTests(PostgresAuthFixture fixture) : IClassFixture<PostgresAuthFixture>
{
    [PostgresFact]
    public async Task ConcurrentViews_DeduplicatePerAccountAndRetainGuestVisits()
    {
        var owner = await fixture.WithService(auth => auth.RegisterAsync(PostgresAuthFixture.NewUser(), default));
        var other = await fixture.WithService(auth => auth.RegisterAsync(PostgresAuthFixture.NewUser(), default));
        using var scope = fixture.Factory.Services.CreateScope();
        var recipes = scope.ServiceProvider.GetRequiredService<IRecipeService>();
        var ingredient = await recipes.SaveIngredientAsync(null, new("View test rice", "g"), default);
        var dish = await recipes.SaveAsync(null, new("View test dish", "Test description", 2, 5, 10, "Easy", "Published",
            [new(ingredient.Id, 100, "g", null, 1)], [new(1, "Cook rice", 10)], [], [], []), owner.Id, false, default);

        async Task Record(Guid? userId)
        {
            using var request = fixture.Factory.Services.CreateScope();
            await request.ServiceProvider.GetRequiredService<ISocialService>().ViewAsync(dish.Summary.Id, userId, default);
        }

        await Task.WhenAll(Enumerable.Range(0, 4).Select(_ => Record(owner.Id)));
        await Record(other.Id);
        await Record(null);
        await Record(null);
        var database = scope.ServiceProvider.GetRequiredService<RecipeHubDbContext>();
        var views = database.Set<RecipeView>().Where(view => view.RecipeId == dish.Summary.Id);
        Assert.Equal(1, await views.CountAsync(view => view.UserId == owner.Id));
        Assert.Equal(1, await views.CountAsync(view => view.UserId == other.Id));
        Assert.Equal(2, await views.CountAsync(view => view.UserId == null));
    }
}
