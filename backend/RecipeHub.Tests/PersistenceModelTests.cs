using Microsoft.EntityFrameworkCore;
using RecipeHub.Domain.Recipes;
using RecipeHub.Infrastructure.Identity;
using RecipeHub.Infrastructure.Persistence;
using Xunit;

namespace RecipeHub.Tests;

// Provider/model tests; these do not connect to PostgreSQL or replace DB integration tests.
public sealed class PersistenceModelTests
{
    private static RecipeHubDbContext CreateContext() =>
        new(new DbContextOptionsBuilder<RecipeHubDbContext>()
            .UseNpgsql()
            .Options);

    [Fact]
    public void PostgresSchema_GeneratesWeightedSearchAndIntegrityConstraints()
    {
        using var context = CreateContext();
        var sql = context.Database.GenerateCreateScript();
        Assert.Contains("GENERATED ALWAYS AS", sql);
        Assert.Contains("USING GIN", sql);
        Assert.Contains("setweight(to_tsvector", sql);
        Assert.Contains("CK_Recipe_PublishedAt", sql);
        Assert.Contains("CK_RecipeIngredient_Quantity", sql);
        Assert.Contains("CK_RefreshToken_Expiry", sql);
        Assert.Contains("numeric(12,3)", sql);
    }

    [Fact]
    public void DeleteRules_ProtectAuthorsAndIngredients_AndCascadeRecipeChildren()
    {
        using var context = CreateContext();
        var recipe = context.Model.FindEntityType(typeof(Recipe))!;
        Assert.Equal(DeleteBehavior.Restrict, Assert.Single(recipe.GetForeignKeys()).DeleteBehavior);
        var ingredientRow = context.Model.FindEntityType(typeof(RecipeIngredient))!;
        Assert.Equal(DeleteBehavior.Restrict, ingredientRow.GetForeignKeys()
            .Single(x => x.PrincipalEntityType.ClrType == typeof(Ingredient)).DeleteBehavior);
        Assert.Equal(DeleteBehavior.Cascade, ingredientRow.GetForeignKeys()
            .Single(x => x.PrincipalEntityType.ClrType == typeof(Recipe)).DeleteBehavior);
    }

    [Fact]
    public void DuplicateEmailsTokensAndRecipePositions_AreProtectedByUniqueIndexes()
    {
        using var context = CreateContext();
        AssertUnique<ApplicationUser>(context, nameof(ApplicationUser.NormalizedEmail));
        AssertUnique<RefreshToken>(context, nameof(RefreshToken.TokenHash));
        AssertUnique<Recipe>(context, nameof(Recipe.Slug));
        AssertUnique<RecipeStep>(context, nameof(RecipeStep.RecipeId), nameof(RecipeStep.Position));
        AssertUnique<RecipeIngredient>(context, nameof(RecipeIngredient.RecipeId), nameof(RecipeIngredient.Position));
    }

    private static void AssertUnique<T>(RecipeHubDbContext context, params string[] properties)
    {
        var entity = context.Model.FindEntityType(typeof(T))!;
        Assert.Contains(entity.GetIndexes(), index => index.IsUnique &&
            index.Properties.Select(x => x.Name).SequenceEqual(properties));
    }
}
