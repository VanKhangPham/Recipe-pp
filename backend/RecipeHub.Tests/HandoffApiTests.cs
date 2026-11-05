using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.Extensions.DependencyInjection;
using RecipeHub.Application.Features;
using RecipeHub.Application.Identity;
using RecipeHub.Application.Recipes;
using Xunit;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using RecipeHub.Infrastructure.Persistence;

namespace RecipeHub.Tests;

[Collection("Postgres auth")]
public sealed class HandoffApiTests(PostgresAuthFixture fixture) : IClassFixture<PostgresAuthFixture>
{
    [PostgresFact]
    public async Task PublishedSearchRecommendationsAndModerationUseSameRecipe()
    {
        var user = await fixture.WithService(a => a.RegisterAsync(PostgresAuthFixture.NewUser(), default));
        using var scope = fixture.Factory.Services.CreateScope();
        var recipes = scope.ServiceProvider.GetRequiredService<IRecipeService>();
        var ingredient = await recipes.SaveIngredientAsync(null, new("Mint", "g"), default);
        var write = new RecipeWrite("Mint soup", "Fresh soup", 2, 5, 20, "Easy", "Published",
            [new(ingredient.Id, 50, "g", null, 1)], [new(1, "Cook", 20)], [], [], []);
        var dish = await recipes.SaveAsync(null, write, user.Id, false, default);
        await recipes.SaveAsync(null, write with { Status = "Draft" }, user.Id, false, default);
        using var errors = new TestErrorLogger();
        using var logged = fixture.Factory.WithWebHostBuilder(b => b.ConfigureTestServices(services =>
            services.AddLogging(logging => logging.AddProvider(errors))));
        using var client = logged.CreateClient();
        Assert.Equal(ingredient, await client.GetFromJsonAsync<IngredientDto>($"/api/v1/ingredients/{ingredient.Id}"));
        Assert.Equal(HttpStatusCode.NotFound, (await client.GetAsync($"/api/v1/ingredients/{Guid.NewGuid()}")).StatusCode);
        var id = dish.Summary.Id;
        Assert.Equal(HttpStatusCode.Unauthorized,
            (await client.PostAsJsonAsync("/api/v1/recipes", write)).StatusCode);
        var search = await client.GetFromJsonAsync<PageResult<RecipeSummary>>("/api/v1/recipes?q=mint&sort=rating");
        Assert.Equal(id, Assert.Single(search!.Items).Id);
        var suggestions = await client.GetFromJsonAsync<RecommendationDto[]>($"/api/v1/recommendations?ingredientIds={ingredient.Id}");
        Assert.Contains("ingredient-match", Assert.Single(suggestions!).Reasons);
        var issuer = fixture.Factory.Services.GetRequiredService<IAccessTokenIssuer>();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", issuer.Issue(user).Value);
        Assert.Equal(HttpStatusCode.BadRequest,
            (await client.PostAsJsonAsync("/api/v1/recipes", write with { Ingredients = [null!] })).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest,
            (await client.PostAsJsonAsync("/api/v1/recipes", write with { Steps = [null!] })).StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest,
            (await client.PostAsJsonAsync("/api/v1/recipes", write with { Images = [null!] })).StatusCode);
        var ownerDraft = await client.PostAsJsonAsync("/api/v1/recipes", write with { Title = "Private mint", Status = "Draft" });
        Assert.Equal(HttpStatusCode.Created, ownerDraft.StatusCode);
        var draft = await ownerDraft.Content.ReadFromJsonAsync<RecipeDetail>();
        Assert.Equal("Draft", draft!.Summary.Status);
        Assert.Equal(HttpStatusCode.OK, (await client.GetAsync($"/api/v1/recipes/{draft.Summary.Id}")).StatusCode);
        var updated = await client.PutAsJsonAsync($"/api/v1/recipes/{draft.Summary.Id}",
            write with { Title = "Updated private mint", Status = "Draft", Steps = [new(1, "Simmer", 10)] });
        Assert.True(updated.IsSuccessStatusCode, $"Update returned {updated.StatusCode}. {errors.Diagnostics}");
        var updatedDraft = await updated.Content.ReadFromJsonAsync<RecipeDetail>();
        Assert.Equal("Updated private mint", updatedDraft!.Summary.Title);
        Assert.Equal("Simmer", Assert.Single(updatedDraft.Steps).Instruction);
        var concurrentWrites = new[]
        {
            write with { Title = "Concurrent A", Status = "Draft", Steps = [new(1, "Step A", 10)] },
            write with { Title = "Concurrent B", Status = "Draft", Steps = [new(1, "Step B", 15)] }
        };
        var concurrentResponses = await Task.WhenAll(concurrentWrites.Select(request =>
            client.PutAsJsonAsync($"/api/v1/recipes/{draft.Summary.Id}", request)));
        foreach (var response in concurrentResponses)
        {
            using (response) response.EnsureSuccessStatusCode();
        }
        var finalDraft = await client.GetFromJsonAsync<RecipeDetail>($"/api/v1/recipes/{draft.Summary.Id}");
        var expectedWrite = Assert.Single(concurrentWrites, request => request.Title == finalDraft!.Summary.Title);
        Assert.Equal(expectedWrite.Steps[0].Instruction, Assert.Single(finalDraft!.Steps).Instruction);
        Assert.Single(finalDraft.Ingredients);
        for (var attempt = 0; attempt < 5; attempt++)
        {
            using var repeatedUpdate = await client.PutAsJsonAsync($"/api/v1/recipes/{draft.Summary.Id}", concurrentWrites[attempt % 2]);
            Assert.True(repeatedUpdate.IsSuccessStatusCode,
                $"Update attempt {attempt + 1} returned {repeatedUpdate.StatusCode}. {errors.Diagnostics}");
        }
        var stranger = await fixture.WithService(a => a.RegisterAsync(PostgresAuthFixture.NewUser(), default));
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", issuer.Issue(stranger).Value);
        Assert.Equal(HttpStatusCode.NotFound, (await client.GetAsync($"/api/v1/recipes/{draft.Summary.Id}")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound,
            (await client.PutAsJsonAsync($"/api/v1/recipes/{id}", write with { Title = "Unauthorized edit" })).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await client.DeleteAsync($"/api/v1/recipes/{id}")).StatusCode);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", issuer.Issue(user).Value);
        Assert.Equal(HttpStatusCode.NoContent, (await client.DeleteAsync($"/api/v1/recipes/{draft.Summary.Id}")).StatusCode);
        var archived = await client.GetFromJsonAsync<RecipeDetail>($"/api/v1/recipes/{draft.Summary.Id}");
        Assert.Equal("Archived", archived!.Summary.Status);
        var created = await client.PostAsJsonAsync($"/api/v1/recipes/{id}/reviews", new ReviewWrite(5, "Good soup"));
        Assert.Equal(HttpStatusCode.Created, created.StatusCode);
        var review = await created.Content.ReadFromJsonAsync<ReviewDto>();
        Assert.Equal(HttpStatusCode.Forbidden, (await client.GetAsync("/api/v1/admin/users")).StatusCode);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", issuer.Issue(user with { Roles = ["Admin"] }).Value);
        foreach (var catalog in new[] { "categories", "tags" })
        {
            var createdName = await client.PostAsJsonAsync($"/api/v1/admin/{catalog}", new NamedWrite("Fresh", "fresh"));
            Assert.Equal(HttpStatusCode.Created, createdName.StatusCode);
            var name = await createdName.Content.ReadFromJsonAsync<NamedItem>();
            Assert.NotNull(createdName.Headers.Location);
            Assert.Equal(name, await client.GetFromJsonAsync<NamedItem>(createdName.Headers.Location));
            client.DefaultRequestHeaders.Authorization = null;
            Assert.Equal(name, await client.GetFromJsonAsync<NamedItem>($"/api/v1/{catalog}/{name!.Id}"));
            Assert.Equal(HttpStatusCode.NotFound, (await client.GetAsync($"/api/v1/{catalog}/{Guid.NewGuid()}")).StatusCode);
            Assert.Equal(HttpStatusCode.Unauthorized, (await client.GetAsync(createdName.Headers.Location)).StatusCode);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", issuer.Issue(user).Value);
            Assert.Equal(HttpStatusCode.Forbidden, (await client.GetAsync(createdName.Headers.Location)).StatusCode);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", issuer.Issue(user with { Roles = ["Admin"] }).Value);
        }
        Assert.True((await client.GetFromJsonAsync<PageResult<AdminUserDto>>("/api/v1/admin/users"))!.TotalCount > 0);
        Assert.Equal(review!.Id, Assert.Single((await client.GetFromJsonAsync<PageResult<ReviewDto>>("/api/v1/admin/reviews?moderationStatus=Visible"))!.Items).Id);
        (await client.PatchAsJsonAsync($"/api/v1/admin/reviews/{review.Id}/moderation", new ModerationWrite("Hidden"))).EnsureSuccessStatusCode();
        Assert.Empty((await client.GetFromJsonAsync<PageResult<ReviewDto>>($"/api/v1/recipes/{id}/reviews"))!.Items);
        Assert.True((await client.GetFromJsonAsync<AnalyticsDto>("/api/v1/admin/analytics"))!.TotalRecipes >= 2);
        var lockResponse = await client.PatchAsJsonAsync($"/api/v1/admin/users/{stranger.Id}/status", new UserStatusWrite(true));
        lockResponse.EnsureSuccessStatusCode();
        Assert.True((await lockResponse.Content.ReadFromJsonAsync<AdminUserDto>())!.IsLocked);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", issuer.Issue(stranger).Value);
        Assert.Equal(HttpStatusCode.Unauthorized, (await client.GetAsync("/api/v1/users/me")).StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, (await client.GetAsync("/api/v1/users/me/recipes")).StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized,
            (await client.PostAsJsonAsync("/api/v1/recipes", write)).StatusCode);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", issuer.Issue(user with { Roles = ["Admin"] }).Value);
        var unlockResponse = await client.PatchAsJsonAsync($"/api/v1/admin/users/{stranger.Id}/status", new UserStatusWrite(false));
        unlockResponse.EnsureSuccessStatusCode();
        Assert.False((await unlockResponse.Content.ReadFromJsonAsync<AdminUserDto>())!.IsLocked);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", issuer.Issue(stranger).Value);
        Assert.Equal(HttpStatusCode.OK, (await client.GetAsync("/api/v1/users/me/recipes")).StatusCode);
        Assert.Equal(HttpStatusCode.OK, (await client.GetAsync("/health/ready")).StatusCode);
        var database = scope.ServiceProvider.GetRequiredService<RecipeHubDbContext>();
        var history = database.GetService<IHistoryRepository>();
        var lastMigration = (await history.GetAppliedMigrationsAsync()).Last();
        try
        {
            await database.Database.ExecuteSqlRawAsync(history.GetDeleteScript(lastMigration.MigrationId));
            Assert.Equal(HttpStatusCode.ServiceUnavailable, (await client.GetAsync("/health/ready")).StatusCode);
            Assert.Equal(HttpStatusCode.OK, (await client.GetAsync("/health/live")).StatusCode);
        }
        finally
        {
            await database.Database.ExecuteSqlRawAsync(history.GetInsertScript(lastMigration));
        }
        Assert.Equal(HttpStatusCode.OK, (await client.GetAsync("/health/ready")).StatusCode);
    }
}






