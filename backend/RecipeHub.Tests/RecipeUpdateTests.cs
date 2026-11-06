using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using RecipeHub.Application.Identity;
using RecipeHub.Application.Recipes;
using Xunit;

namespace RecipeHub.Tests;

[Collection("Postgres auth")]
public sealed class RecipeUpdateTests(PostgresAuthFixture fixture) : IClassFixture<PostgresAuthFixture>
{
    [PostgresFact]
    public async Task SameServiceCanReplacePreviouslyTrackedRecipeChildren()
    {
        var user = await fixture.WithService(auth => auth.RegisterAsync(PostgresAuthFixture.NewUser(), default));
        using var scope = fixture.Factory.Services.CreateScope();
        var recipes = scope.ServiceProvider.GetRequiredService<IRecipeService>();
        var ingredient = await recipes.SaveIngredientAsync(null, new("Tracked ingredient", "g"), default);
        var category = await recipes.SaveNameAsync(false, null, new("Tracked category", "tracked-category"), default);
        var tag = await recipes.SaveNameAsync(true, null, new("Tracked tag", "tracked-tag"), default);
        var request = new RecipeWrite("Tracked recipe", "Temporary data", 2, 5, 10, "Easy", "Draft",
            [new(ingredient.Id, 10, "g", null, 1)], [new(1, "First step", 10)], [category.Id], [tag.Id], []);
        var created = await recipes.SaveAsync(null, request, user.Id, false, default);
        for (var attempt = 0; attempt < 2; attempt++)
        {
            var updated = await recipes.SaveAsync(created.Summary.Id,
                request with { Steps = [new(1, "Replacement step", 5)] }, user.Id, false, default);
            Assert.Equal("Replacement step", Assert.Single(updated.Steps).Instruction);
            Assert.Single(updated.Ingredients);
            Assert.Single(updated.Summary.Categories);
            Assert.Single(updated.Tags);
        }
    }

    [PostgresFact]
    public async Task RepeatedUpdatesKeepExactlyOneSetOfChildren()
    {
        var user = await fixture.WithService(auth => auth.RegisterAsync(PostgresAuthFixture.NewUser(), default));
        using var scope = fixture.Factory.Services.CreateScope();
        var recipes = scope.ServiceProvider.GetRequiredService<IRecipeService>();
        var ingredient = await recipes.SaveIngredientAsync(null, new("Update diagnostic", "g"), default);
        var category = await recipes.SaveNameAsync(false, null, new("Update diagnostic", "update-diagnostic"), default);
        var tag = await recipes.SaveNameAsync(true, null, new("Update diagnostic", "update-diagnostic"), default);
        var request = new RecipeWrite("Diagnostic recipe", "Temporary test data", 2, 5, 10, "Easy", "Draft",
            [new(ingredient.Id, 10, "g", null, 1)], [new(1, "Cook", 10)], [category.Id], [tag.Id],
            [new("https://example.com/test.jpg", "Test image", 0)]);
        var recipe = await recipes.SaveAsync(null, request, user.Id, false, default);
        using var errors = new TestErrorLogger();
        using var factory = fixture.Factory.WithWebHostBuilder(builder => builder.ConfigureTestServices(services =>
            services.AddLogging(logging => logging.AddProvider(errors))));
        using var client = factory.CreateClient();
        var issuer = factory.Services.GetRequiredService<IAccessTokenIssuer>();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", issuer.Issue(user).Value);
        for (var attempt = 1; attempt <= 12; attempt++)
        {
            var write = request with { Title = $"Diagnostic update {attempt}" };
            using var response = await client.PutAsJsonAsync($"/api/v1/recipes/{recipe.Summary.Id}", write);
            Assert.True(response.IsSuccessStatusCode, $"Attempt {attempt}: {response.StatusCode}. {errors.Diagnostics}");
            var updated = await response.Content.ReadFromJsonAsync<RecipeDetail>();
            Assert.Equal(write.Title, updated!.Summary.Title);
            Assert.Single(updated.Ingredients);
            Assert.Single(updated.Steps);
            Assert.Single(updated.Images);
            Assert.Single(updated.Tags);
            Assert.Single(updated.Summary.Categories);
        }
    }
}
