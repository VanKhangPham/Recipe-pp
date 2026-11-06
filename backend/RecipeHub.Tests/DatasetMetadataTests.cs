using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;
using RecipeHub.Application.Recipes;
using RecipeHub.Domain.Recipes;
using RecipeHub.Infrastructure.Persistence;
using Xunit;

namespace RecipeHub.Tests;

[Collection("Postgres auth")]
public sealed class DatasetMetadataTests(PostgresAuthFixture fixture) : IClassFixture<PostgresAuthFixture>
{
    [PostgresFact]
    public async Task DatasetMetadataPersistsAndRejectsDuplicateKeys()
    {
        var user = await fixture.WithService(auth => auth.RegisterAsync(PostgresAuthFixture.NewUser(), default));
        using var scope = fixture.Factory.Services.CreateScope();
        var service = scope.ServiceProvider.GetRequiredService<IRecipeService>();
        var ingredient = await service.SaveIngredientAsync(null, new("Dataset ingredient", "g"), default);
        var write = new RecipeWrite("Dataset draft", "Temporary test data", 2, 5, 10, "Easy", "Draft",
            [new(ingredient.Id, 10, "g", null, 1)], [new(1, "Cook", 10)], [], [], []);
        var first = await service.SaveAsync(null, write, user.Id, false, default);
        var second = await service.SaveAsync(null, write, user.Id, false, default);
        var db = scope.ServiceProvider.GetRequiredService<RecipeHubDbContext>();
        db.Add(new RecipeDatasetEntry
        {
            RecipeId = first.Summary.Id, DatasetKey = "sample-draft", ContentHash = new string('a', 64),
            SourceType = "AI-assisted draft", ImportedAt = DateTimeOffset.UtcNow
        });
        await db.SaveChangesAsync();
        using var verification = fixture.Factory.Services.CreateScope();
        var persisted = await verification.ServiceProvider.GetRequiredService<RecipeHubDbContext>()
            .Set<RecipeDatasetEntry>().AsNoTracking().SingleAsync();
        Assert.Equal("Pending", persisted.ReviewStatus);
        Assert.Equal(first.Summary.Id, persisted.RecipeId);
        db.Add(new RecipeDatasetEntry
        {
            RecipeId = second.Summary.Id, DatasetKey = "sample-draft", ContentHash = new string('b', 64),
            SourceType = "AI-assisted draft", ImportedAt = DateTimeOffset.UtcNow
        });
        var exception = await Assert.ThrowsAsync<DbUpdateException>(() => db.SaveChangesAsync());
        Assert.Equal(PostgresErrorCodes.UniqueViolation, Assert.IsType<PostgresException>(exception.InnerException).SqlState);
    }
}
