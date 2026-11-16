using System.Text.Json;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using RecipeHub.Application.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using RecipeHub.Application.Recipes;
using RecipeHub.Application.Features;
using RecipeHub.Domain.Features;
using RecipeHub.Domain.Recipes;
using RecipeHub.Infrastructure.Persistence;
using RecipeHub.Infrastructure.Recipes;
using Xunit;

namespace RecipeHub.Tests;

[Collection("Postgres auth")]
public sealed class DatasetImportTests(PostgresAuthFixture fixture) : IClassFixture<PostgresAuthFixture>
{
    [PostgresFact]
    public async Task ImportIsRepeatableAndRollsBackBatchOnConflict()
    {
        var user = await fixture.WithService(auth => auth.RegisterAsync(PostgresAuthFixture.NewUser(), default));
        var row = new DatasetRecipe("import-test", "Món thử", "Món thử", 2, 5, 10, "Draft",
            new("AI-assisted draft", "pending", false), [new("Trứng gà", 2, "piece")], ["Nấu chín."]);
        var json = JsonSerializer.Serialize(new[] { row });
        using (var scope = fixture.Factory.Services.CreateScope())
        {
            var result = await DatasetImporter.ImportAsync(scope.ServiceProvider.GetRequiredService<RecipeHubDbContext>(), json, user.Id);
            Assert.Equal(new DatasetImportResult(1, 0), result);
        }
        using (var scope = fixture.Factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<RecipeHubDbContext>();
            Assert.Equal(new DatasetImportResult(0, 1), await DatasetImporter.ImportAsync(db, json, user.Id));
            var recipe = await db.Recipes.SingleAsync();
            Assert.Equal("Draft", recipe.Status);
            var entry = await db.Set<RecipeDatasetEntry>().SingleAsync();
            Assert.Equal("Pending", entry.ReviewStatus);
            var service = scope.ServiceProvider.GetRequiredService<IRecipeService>();
            var ingredient = await db.Ingredients.SingleAsync();
            await Assert.ThrowsAsync<RecipeHub.Application.Identity.AuthException>(() => service.SaveAsync(recipe.Id,
                new("Món thử", "Test", 2, 5, 10, "Easy", "Published", [new(ingredient.Id, 2, "piece", null, 1)],
                    [new(1, "Nấu chín", 10)], [], [], []), user.Id, false, default));
        }
        using (var reviewScope = fixture.Factory.Services.CreateScope())
        {
            var db = reviewScope.ServiceProvider.GetRequiredService<RecipeHubDbContext>();
            var recipeId = await db.Recipes.Select(value => value.Id).SingleAsync();
            var admin = reviewScope.ServiceProvider.GetRequiredService<IAdministrationService>();
            await Assert.ThrowsAsync<RecipeHub.Application.Identity.AuthException>(() => admin.ReviewDatasetAsync(user.Id, recipeId,
                new("Approved", null, null, null), default));
            using var client = fixture.Factory.CreateClient();
            var route = $"/api/v1/admin/dataset/{recipeId}/review";
            var approval = new DatasetReviewWrite("Approved", "Test fixture", null, "Test-only");
            Assert.Equal(HttpStatusCode.Unauthorized, (await client.PatchAsJsonAsync(route, approval)).StatusCode);
            var issuer = fixture.Factory.Services.GetRequiredService<IAccessTokenIssuer>();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", issuer.Issue(user).Value);
            Assert.Equal(HttpStatusCode.Forbidden, (await client.PatchAsJsonAsync(route, approval)).StatusCode);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", issuer.Issue(user with { Roles = ["Admin"] }).Value);
            Assert.Equal(HttpStatusCode.BadRequest, (await client.PatchAsJsonAsync(route,
                approval with { SourceName = null })).StatusCode);
            Assert.Equal(HttpStatusCode.BadRequest, (await client.PatchAsJsonAsync(route,
                approval with { SourceUrl = "http://example.com" })).StatusCode);
            Assert.Equal(HttpStatusCode.NotFound, (await client.PatchAsJsonAsync(
                $"/api/v1/admin/dataset/{Guid.NewGuid()}/review", approval)).StatusCode);
            var approvalResponse = await client.PatchAsJsonAsync(route, approval);
            approvalResponse.EnsureSuccessStatusCode();
            var approved = (await approvalResponse.Content.ReadFromJsonAsync<DatasetReviewDto>())!;
            Assert.Equal("Approved", approved.Status);
            Assert.Equal("Draft", (await db.Recipes.SingleAsync()).Status);
            var service = reviewScope.ServiceProvider.GetRequiredService<IRecipeService>();
            var ingredient = await db.Ingredients.SingleAsync();
            var published = await service.SaveAsync(recipeId, new("Món thử", "Test", 2, 5, 10, "Easy", "Published",
                [new(ingredient.Id, 2, "piece", null, 1)], [new(1, "Nấu chín", 10)], [], [], []), user.Id, false, default);
            Assert.Equal("Published", published.Summary.Status);
            (await client.PatchAsJsonAsync(route, approval with { Status = "Rejected" })).EnsureSuccessStatusCode();
            await db.Entry(await db.Recipes.SingleAsync()).ReloadAsync();
            Assert.Equal("Draft", (await db.Recipes.SingleAsync()).Status);
            Assert.Equal(2, await db.Set<AuditLog>().CountAsync(value => value.ActorUserId == user.Id && value.EntityId == recipeId.ToString()));
        }
        using (var scope = fixture.Factory.Services.CreateScope())
        {
            var batch = JsonSerializer.Serialize(new[] { row with { DatasetKey = "new-entry", Title = "Món mới" }, row with { Title = "Conflicting edit" } });
            await Assert.ThrowsAsync<InvalidOperationException>(() => DatasetImporter.ImportAsync(
                scope.ServiceProvider.GetRequiredService<RecipeHubDbContext>(), batch, user.Id));
        }
        using var verification = fixture.Factory.Services.CreateScope();
        var verified = verification.ServiceProvider.GetRequiredService<RecipeHubDbContext>();
        Assert.Equal(1, await verified.Recipes.CountAsync());
        Assert.Equal(1, await verified.Set<RecipeDatasetEntry>().CountAsync());
        Assert.Throws<InvalidOperationException>(() => DatasetImporter.Read(JsonSerializer.Serialize(new[] { row with { Status = "Published" } })));
    }

    [Fact]
    public void CanonizeIngredientAndReadValidateAliasesAndDescriptions()
    {
        Assert.Equal(("Thịt heo", "thịt heo"), DatasetImporter.CanonizeIngredient("  Thịt   lợn "));
        Assert.Equal(("Đậu hũ", "đậu hũ"), DatasetImporter.CanonizeIngredient("Đậu phụ"));
        Assert.Equal(("Ngò rí", "ngò rí"), DatasetImporter.CanonizeIngredient("Rau mùi"));
        Assert.Equal(("Ngò gai", "ngò gai"), DatasetImporter.CanonizeIngredient("Mùi tàu"));
        Assert.Equal(("Bột ngọt", "bột ngọt"), DatasetImporter.CanonizeIngredient("Mì chính"));
        Assert.Equal(("Hành tím", "hành tím"), DatasetImporter.CanonizeIngredient("Hành khô"));

        var baseRecipe = new DatasetRecipe("thit-kho", "Thịt kho", "Món mặn", 2, 10, 30, "Draft",
            new("AI-assisted draft", "pending", false),
            [new("Thịt lợn", 300, "g"), new("Thịt heo", 100, "g")],
            ["Kho thịt."]);
        Assert.Throws<InvalidOperationException>(() => DatasetImporter.Read(JsonSerializer.Serialize(new[] { baseRecipe })));

        var validWithDescription = baseRecipe with
        {
            Ingredients = [new("Thịt lợn", 300, "g")],
            Description = "Món thịt kho đậm đà cho bữa cơm gia đình."
        };
        var parsed = Assert.Single(DatasetImporter.Read(JsonSerializer.Serialize(new[] { validWithDescription })));
        Assert.Equal("Món thịt kho đậm đà cho bữa cơm gia đình.", parsed.Description);

        Assert.Throws<InvalidOperationException>(() => DatasetImporter.Read(
            JsonSerializer.Serialize(new[] { validWithDescription with { Description = "   " } })));
    }
}
