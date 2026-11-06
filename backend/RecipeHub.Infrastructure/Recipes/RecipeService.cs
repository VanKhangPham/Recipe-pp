using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using NpgsqlTypes;
using RecipeHub.Application.Identity;
using RecipeHub.Application.Recipes;
using RecipeHub.Domain.Features;
using RecipeHub.Domain.Recipes;
using RecipeHub.Infrastructure.Persistence;

namespace RecipeHub.Infrastructure.Recipes;

public sealed class RecipeService(RecipeHubDbContext db, TimeProvider clock) : IRecipeService
{
    internal static AuthException Missing() => new(AuthError.NotFound, "Resource not found.");
    internal static AuthException Invalid(string message) => new(AuthError.Validation, message);
    internal static AuthException Conflict(string message) => new(AuthError.Conflict, message);

    internal Expression<Func<Recipe, RecipeSummary>> Summary(bool privateFields) => recipe => new RecipeSummary(
        recipe.Id, recipe.Title, recipe.Slug, recipe.Description.Length > 300 ? recipe.Description.Substring(0, 300) : recipe.Description,
        recipe.Images.OrderBy(x => x.Position).Select(x => x.Url).FirstOrDefault(),
        db.Users.Where(x => x.Id == recipe.AuthorId).Select(x => new PublicAuthor(x.Id, x.DisplayName)).First(),
        recipe.Servings, recipe.PrepMinutes, recipe.CookMinutes, recipe.PrepMinutes + recipe.CookMinutes, recipe.Difficulty,
        db.Set<Review>().Where(x => x.RecipeId == recipe.Id && x.ModerationStatus == "Visible").Select(x => (double?)x.Rating).Average(),
        db.Set<Review>().Count(x => x.RecipeId == recipe.Id && x.ModerationStatus == "Visible"),
        (from link in db.Set<RecipeCategory>() join category in db.Categories on link.CategoryId equals category.Id
         where link.RecipeId == recipe.Id orderby category.Name select new NamedItem(category.Id, category.Name, category.Slug)).ToArray(),
        recipe.CreatedAt, privateFields ? recipe.Status : null);

    public async Task<PageResult<RecipeSummary>> ListAsync(RecipeQuery query, Guid? ownerId, bool admin, CancellationToken ct)
    {
        if (query.Page < 1 || query.Page > 1000000 || query.PageSize is < 1 or > 100) throw Invalid("Invalid pagination.");
        var recipes = db.Recipes.AsNoTracking();
        if (ownerId.HasValue) recipes = recipes.Where(x => x.AuthorId == ownerId.Value);
        else if (!admin) recipes = recipes.Where(x => x.Status == "Published");
        if ((ownerId.HasValue || admin) && query.Status is not null) recipes = recipes.Where(x => x.Status == query.Status);
        if (!string.IsNullOrWhiteSpace(query.Q)) recipes = recipes.Where(x => EF.Property<NpgsqlTsVector>(x, "SearchVector").Matches(EF.Functions.WebSearchToTsQuery("simple", query.Q)));
        if (query.CategoryId.HasValue) recipes = recipes.Where(x => x.Categories.Any(c => c.CategoryId == query.CategoryId));
        if (query.TagId.HasValue) recipes = recipes.Where(x => db.Set<RecipeTag>().Any(t => t.RecipeId == x.Id && t.TagId == query.TagId));
        foreach (var ingredient in query.IngredientIds.Distinct()) recipes = recipes.Where(x => x.Ingredients.Any(i => i.IngredientId == ingredient));
        if (query.MaxTotalMinutes.HasValue) recipes = recipes.Where(x => x.PrepMinutes + x.CookMinutes <= query.MaxTotalMinutes);
        if (query.Difficulty is not null) recipes = recipes.Where(x => x.Difficulty == query.Difficulty);
        var total = await recipes.CountAsync(ct);
        
        var sorted = query.Sort switch
        {
            "newest" => recipes.OrderByDescending(x => x.CreatedAt).ThenBy(x => x.Id),
            "rating" => recipes.OrderByDescending(x => db.Set<Review>().Where(r => r.RecipeId == x.Id && r.ModerationStatus == "Visible").Average(r => (double?)r.Rating) ?? 0).ThenBy(x => x.Id),
            "cookingTime" => recipes.OrderBy(x => x.PrepMinutes + x.CookMinutes).ThenBy(x => x.Id),
            _ => throw Invalid("Invalid sort.")
        };
        return new(await sorted.Skip((query.Page - 1) * query.PageSize).Take(query.PageSize).Select(Summary(ownerId.HasValue || admin)).ToListAsync(ct), query.Page, query.PageSize, total);
    }

    public async Task<RecipeDetail> GetAsync(Guid id, Guid? userId, bool admin, CancellationToken ct)
    {
        var recipe = await db.Recipes.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id, ct) ?? throw Missing();
        if (recipe.Status != "Published" && recipe.AuthorId != userId && !admin) throw Missing();
        var summary = await db.Recipes.Where(x => x.Id == id).Select(Summary(admin || recipe.AuthorId == userId)).SingleAsync(ct);
        // Detail exposes full description, while the list uses a short preview.
        summary = summary with { Description = recipe.Description };
        var ingredients = await (from item in db.Set<RecipeIngredient>() join ingredient in db.Ingredients on item.IngredientId equals ingredient.Id
            where item.RecipeId == id orderby item.Position select new RecipeIngredientDto(item.Id, ingredient.Id, ingredient.Name, item.Quantity, item.Unit, item.Note, item.Position)).ToArrayAsync(ct);
        var steps = await db.Set<RecipeStep>().Where(x => x.RecipeId == id).OrderBy(x => x.Position)
            .Select(x => new RecipeStepDto(x.Id, x.Position, x.Instruction, x.DurationMinutes)).ToArrayAsync(ct);
        var images = await db.Set<RecipeImage>().Where(x => x.RecipeId == id).OrderBy(x => x.Position)
            .Select(x => new RecipeImageDto(x.Id, x.Url, x.AltText, x.Position)).ToArrayAsync(ct);
        var tags = await (from link in db.Set<RecipeTag>() join tag in db.Set<Tag>() on link.TagId equals tag.Id
            where link.RecipeId == id orderby tag.Name select new NamedItem(tag.Id, tag.Name, tag.Slug)).ToArrayAsync(ct);
        var nutrition = await db.Set<NutritionFacts>().Where(x => x.RecipeId == id)
            .Select(x => new NutritionDto(x.Calories, x.ProteinGrams, x.CarbsGrams, x.FatGrams, x.Source)).SingleOrDefaultAsync(ct);
        return new(summary, ingredients, steps, tags, images, nutrition, recipe.PublishedAt, recipe.UpdatedAt);
    }

    public async Task<RecipeDetail> SaveAsync(Guid? id, RecipeWrite request, Guid userId, bool admin, CancellationToken ct)
    {
        ValidateRecipe(request);
        if (await db.Ingredients.CountAsync(x => request.Ingredients.Select(i => i.IngredientId).Contains(x.Id), ct) != request.Ingredients.Select(x => x.IngredientId).Distinct().Count()) throw Invalid("Unknown ingredient ID.");
        if (await db.Categories.CountAsync(x => request.CategoryIds.Contains(x.Id), ct) != request.CategoryIds.Length) throw Invalid("Unknown or duplicate category ID.");
        if (await db.Set<Tag>().CountAsync(x => request.TagIds.Contains(x.Id), ct) != request.TagIds.Length) throw Invalid("Unknown or duplicate tag ID.");
        await using var transaction = await db.Database.BeginTransactionAsync(ct);
        Recipe recipe;
        if (id.HasValue)
        {
            recipe = await db.Recipes.SingleOrDefaultAsync(x => x.Id == id && (x.AuthorId == userId || admin), ct) ?? throw Missing();
            // Serialize mutations before replacing child collections.
            await db.Database.ExecuteSqlInterpolatedAsync($"SELECT 1 FROM \"Recipes\" WHERE \"Id\" = {id.Value} FOR UPDATE", ct);
            await db.Entry(recipe).ReloadAsync(ct);
            // Bulk deletes bypass EF tracking. Detach the old children before replacing them.
            var trackedChildren = db.ChangeTracker.Entries().Where(entry => entry.Entity switch
            {
                RecipeStep step => step.RecipeId == recipe.Id,
                RecipeIngredient ingredient => ingredient.RecipeId == recipe.Id,
                RecipeImage image => image.RecipeId == recipe.Id,
                RecipeCategory category => category.RecipeId == recipe.Id,
                RecipeTag tag => tag.RecipeId == recipe.Id,
                _ => false
            }).ToArray();
            foreach (var child in trackedChildren) child.State = EntityState.Detached;
            await db.Set<RecipeStep>().Where(x => x.RecipeId == id).ExecuteDeleteAsync(ct);
            await db.Set<RecipeIngredient>().Where(x => x.RecipeId == id).ExecuteDeleteAsync(ct);
            await db.Set<RecipeImage>().Where(x => x.RecipeId == id).ExecuteDeleteAsync(ct);
            await db.Set<RecipeCategory>().Where(x => x.RecipeId == id).ExecuteDeleteAsync(ct);
            await db.Set<RecipeTag>().Where(x => x.RecipeId == id).ExecuteDeleteAsync(ct);
        }
        else
        {
            recipe = new Recipe { AuthorId = userId, CreatedAt = clock.GetUtcNow(), Slug = "recipe-" + Guid.NewGuid().ToString("N") };
            db.Recipes.Add(recipe);
        }
        if (id.HasValue && request.Status == "Published" && await db.Set<RecipeDatasetEntry>()
            .AnyAsync(entry => entry.RecipeId == id && entry.ReviewStatus != "Approved", ct))
            throw Invalid("Dataset recipe requires source review before publication.");
        recipe.Title = request.Title.Trim(); recipe.Description = request.Description.Trim(); recipe.Servings = request.Servings;
        recipe.PrepMinutes = request.PrepMinutes; recipe.CookMinutes = request.CookMinutes; recipe.Difficulty = request.Difficulty;
        recipe.Status = request.Status; recipe.UpdatedAt = clock.GetUtcNow();
        if (request.Status == "Published") recipe.PublishedAt ??= clock.GetUtcNow();
        recipe.Steps = request.Steps.Select(x => new RecipeStep { RecipeId = recipe.Id, Position = x.Position, Instruction = x.Instruction.Trim(), DurationMinutes = x.DurationMinutes }).ToList();
        recipe.Ingredients = request.Ingredients.Select(x => new RecipeIngredient { RecipeId = recipe.Id, IngredientId = x.IngredientId, Quantity = x.Quantity, Unit = x.Unit, Note = x.Note, Position = x.Position }).ToList();
        recipe.Images = request.Images.Select(x => new RecipeImage { RecipeId = recipe.Id, Position = x.Position, Url = x.Url, AltText = x.AltText }).ToList();
        recipe.Categories = request.CategoryIds.Select(x => new RecipeCategory { RecipeId = recipe.Id, CategoryId = x }).ToList();
        db.AddRange(recipe.Steps);
        db.AddRange(recipe.Ingredients);
        db.AddRange(recipe.Images);
        db.AddRange(recipe.Categories);
        db.Set<RecipeTag>().AddRange(request.TagIds.Select(x => new RecipeTag { RecipeId = recipe.Id, TagId = x }));
        await SaveAsync(ct); await transaction.CommitAsync(ct);
        return await GetAsync(recipe.Id, userId, admin, ct);
    }

    private static void ValidateRecipe(RecipeWrite request)
    {
        if (request.Ingredients.Any(x => x is null) || request.Steps.Any(x => x is null) || request.Images.Any(x => x is null))
            throw Invalid("Ingredients, steps and images cannot contain null items.");
        if (string.IsNullOrWhiteSpace(request.Title) || request.Steps.Any(x => string.IsNullOrWhiteSpace(x.Instruction))) throw Invalid("Title and instructions cannot be blank.");
        if (!request.Steps.Select(x => x.Position).Order().SequenceEqual(Enumerable.Range(1, request.Steps.Length)) ||
            !request.Ingredients.Select(x => x.Position).Order().SequenceEqual(Enumerable.Range(1, request.Ingredients.Length)) ||
            !request.Images.Select(x => x.Position).Order().SequenceEqual(Enumerable.Range(0, request.Images.Length))) throw Invalid("Positions must be consecutive and unique.");
        if (request.Ingredients.Any(x => decimal.Round(x.Quantity, 3) != x.Quantity)) throw Invalid("Quantity supports at most 3 decimal places.");
        if (request.Images.Any(x => !Uri.TryCreate(x.Url, UriKind.Absolute, out var uri) || uri.Scheme != "https")) throw Invalid("Images must use absolute HTTPS URLs.");
    }

    public async Task ArchiveAsync(Guid id, Guid userId, bool admin, CancellationToken ct)
    {
        await using var transaction = await db.Database.BeginTransactionAsync(ct);
        var recipe = await db.Recipes.SingleOrDefaultAsync(x => x.Id == id && (x.AuthorId == userId || admin), ct) ?? throw Missing();
        await db.Database.ExecuteSqlInterpolatedAsync($"SELECT 1 FROM \"Recipes\" WHERE \"Id\" = {id} FOR UPDATE", ct);
        await db.Entry(recipe).ReloadAsync(ct);
        recipe.Status = "Archived"; recipe.UpdatedAt = clock.GetUtcNow(); await SaveAsync(ct);
        await transaction.CommitAsync(ct);
    }

    public async Task<PageResult<IngredientDto>> IngredientsAsync(string? q, PageQuery page, CancellationToken ct)
    {
        var query = db.Ingredients.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(q)) query = query.Where(x => x.NormalizedName.Contains(q.Trim().ToLowerInvariant()));
        var count = await query.CountAsync(ct);
        return new(await query.OrderBy(x => x.Name).ThenBy(x => x.Id).Skip((page.Page - 1) * page.PageSize).Take(page.PageSize)
            .Select(x => new IngredientDto(x.Id, x.Name, x.DefaultUnit)).ToListAsync(ct), page.Page, page.PageSize, count);
    }
    public async Task<IngredientDto> GetIngredientAsync(Guid id, CancellationToken ct) =>
        await db.Ingredients.AsNoTracking().Where(x => x.Id == id)
            .Select(x => new IngredientDto(x.Id, x.Name, x.DefaultUnit)).SingleOrDefaultAsync(ct) ?? throw Missing();

    public async Task<IngredientDto> SaveIngredientAsync(Guid? id, IngredientWrite request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Name)) throw Invalid("Name is required.");
        var ingredient = id.HasValue ? await db.Ingredients.FindAsync([id.Value], ct) ?? throw Missing() : new Ingredient();
        if (!id.HasValue) db.Ingredients.Add(ingredient);
        ingredient.Name = request.Name.Trim(); ingredient.NormalizedName = ingredient.Name.ToLowerInvariant(); ingredient.DefaultUnit = request.DefaultUnit;
        await SaveAsync(ct); return new(ingredient.Id, ingredient.Name, ingredient.DefaultUnit);
    }
    public async Task DeleteIngredientAsync(Guid id, CancellationToken ct)
    {
        db.Ingredients.Remove(await db.Ingredients.FindAsync([id], ct) ?? throw Missing()); await SaveAsync(ct);
    }
    public Task<NamedItem[]> NamesAsync(bool tags, CancellationToken ct) => tags
        ? db.Set<Tag>().OrderBy(x => x.Name).Select(x => new NamedItem(x.Id, x.Name, x.Slug)).ToArrayAsync(ct)
        : db.Categories.OrderBy(x => x.Name).Select(x => new NamedItem(x.Id, x.Name, x.Slug)).ToArrayAsync(ct);
    public async Task<NamedItem> GetNameAsync(bool tags, Guid id, CancellationToken ct)
    {
        var item = tags
            ? await db.Set<Tag>().AsNoTracking().Where(x => x.Id == id).Select(x => new NamedItem(x.Id, x.Name, x.Slug)).SingleOrDefaultAsync(ct)
            : await db.Categories.AsNoTracking().Where(x => x.Id == id).Select(x => new NamedItem(x.Id, x.Name, x.Slug)).SingleOrDefaultAsync(ct);
        return item ?? throw Missing();
    }

    public async Task<NamedItem> SaveNameAsync(bool tags, Guid? id, NamedWrite request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(request.Name)) throw Invalid("Name is required.");
        NamedItem result;
        if (tags)
        {
            var tag = id.HasValue ? await db.Set<Tag>().FindAsync([id.Value], ct) ?? throw Missing() : new Tag();
            if (!id.HasValue) db.Add(tag); tag.Name = request.Name.Trim(); tag.Slug = request.Slug;
            result = new(tag.Id, tag.Name, tag.Slug);
        }
        else
        {
            var category = id.HasValue ? await db.Categories.FindAsync([id.Value], ct) ?? throw Missing() : new Category();
            if (!id.HasValue) db.Add(category); category.Name = request.Name.Trim(); category.Slug = request.Slug;
            result = new(category.Id, category.Name, category.Slug);
        }
        await SaveAsync(ct); return result;
    }
    public async Task DeleteNameAsync(bool tags, Guid id, CancellationToken ct)
    {
        if (tags) db.Remove(await db.Set<Tag>().FindAsync([id], ct) ?? throw Missing());
        else db.Remove(await db.Categories.FindAsync([id], ct) ?? throw Missing());
        await SaveAsync(ct);
    }
    internal async Task SaveAsync(CancellationToken ct)
    {
        try { await db.SaveChangesAsync(ct); }
        catch (DbUpdateException ex) when (ex.InnerException is PostgresException { SqlState: PostgresErrorCodes.UniqueViolation }) { throw Conflict("A record with the same key already exists."); }
        catch (DbUpdateException ex) when (ex.InnerException is PostgresException { SqlState: PostgresErrorCodes.ForeignKeyViolation }) { throw Conflict("Resource is referenced or no longer exists."); }
    }
}

