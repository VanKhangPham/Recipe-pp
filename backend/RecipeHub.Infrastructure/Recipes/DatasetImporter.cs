using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using RecipeHub.Domain.Recipes;
using RecipeHub.Infrastructure.Persistence;

namespace RecipeHub.Infrastructure.Recipes;

public sealed record DatasetIngredient(string Name, decimal Quantity, string Unit);
public sealed record DatasetSource(string Type, string Review, bool PublicationAllowed);
public sealed record DatasetRecipe(string DatasetKey, string Title, string Category, int Servings,
    int PrepMinutes, int CookMinutes, string Status, DatasetSource Source, DatasetIngredient[] Ingredients, string[] Steps,
    string? Description = null);
public sealed record DatasetImportResult(int Created, int Skipped);

public static class DatasetImporter
{
    private static readonly JsonSerializerOptions HashJsonOptions = new()
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    private static readonly IReadOnlyDictionary<string, string> IngredientAliases =
        new Dictionary<string, string>(StringComparer.Ordinal)
        {
            ["thịt lợn"] = "Thịt heo",
            ["thịt heo"] = "Thịt heo",
            ["thịt lợn băm"] = "Thịt băm",
            ["thịt heo băm"] = "Thịt băm",
            ["thịt bằm"] = "Thịt băm",
            ["sườn lợn"] = "Sườn heo",
            ["sườn heo"] = "Sườn heo",
            ["đậu phụ"] = "Đậu hũ",
            ["đậu khuôn"] = "Đậu hũ",
            ["rau mùi"] = "Ngò rí",
            ["mùi ta"] = "Ngò rí",
            ["ngò"] = "Ngò rí",
            ["mùi tàu"] = "Ngò gai",
            ["mì chính"] = "Bột ngọt",
            ["hành khô"] = "Hành tím",
            ["hành củ"] = "Hành tím",
            ["hành hoa"] = "Hành lá",
            ["lạc"] = "Đậu phộng",
            ["dứa"] = "Thơm",
            ["khóm"] = "Thơm",
            ["mướp đắng"] = "Khổ qua",
            ["đậu cô ve"] = "Đậu que",
            ["đậu cove"] = "Đậu que",
            ["cơm nguội"] = "Cơm đã nấu",
            ["nước lọc"] = "Nước",
            ["hạt tiêu"] = "Tiêu",
            ["tiêu xay"] = "Tiêu"
        };

    public static (string DisplayName, string NormalizedName) CanonizeIngredient(string rawName)
    {
        var cleaned = Regex.Replace((rawName ?? string.Empty).Trim().Normalize(), @"\s+", " ");
        var lookupKey = cleaned.ToLowerInvariant();
        if (IngredientAliases.TryGetValue(lookupKey, out var canonical))
            return (canonical, canonical.ToLowerInvariant());
        return (cleaned, lookupKey);
    }

    public static DatasetRecipe[] Read(string json)
    {
        var rows = JsonSerializer.Deserialize<DatasetRecipe[]>(json, new JsonSerializerOptions(JsonSerializerDefaults.Web))
            ?? throw new InvalidOperationException("Expected a recipe array.");
        if (rows.Length is < 1 or > 300) throw new InvalidOperationException("Import supports 1..300 recipes.");
        var keys = new HashSet<string>(StringComparer.Ordinal);
        var titles = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var row in rows)
        {
            if (row is null || string.IsNullOrWhiteSpace(row.DatasetKey) || row.DatasetKey.Length > 150 ||
                !Regex.IsMatch(row.DatasetKey, "^[a-z0-9]+(-[a-z0-9]+)*$") || !keys.Add(row.DatasetKey))
                throw new InvalidOperationException("Invalid or duplicate dataset key.");
            if (string.IsNullOrWhiteSpace(row.Title) || row.Title.Length > 200 || !titles.Add(row.Title.Trim().Normalize()) ||
                string.IsNullOrWhiteSpace(row.Category) || row.Category.Length > 100 || row.Servings is < 1 or > 100 ||
                row.PrepMinutes is < 0 or > 1440 || row.CookMinutes is < 0 or > 1440 ||
                (row.Description is not null && (string.IsNullOrWhiteSpace(row.Description) || row.Description.Length > 2000)))
                throw new InvalidOperationException($"Invalid recipe fields: {row.DatasetKey}");
            if (row.Status != "Draft" || row.Source is null || string.IsNullOrWhiteSpace(row.Source.Type) ||
                row.Source.Type.Length > 100 || row.Source.Review != "pending" || row.Source.PublicationAllowed)
                throw new InvalidOperationException($"Only pending unpublished drafts are supported: {row.DatasetKey}");
            if (row.Ingredients is null || row.Ingredients.Length is < 1 or > 100 || row.Steps is null || row.Steps.Length is < 1 or > 100)
                throw new InvalidOperationException($"Ingredients and steps are required: {row.DatasetKey}");
            var recipeIngredients = new HashSet<string>(StringComparer.Ordinal);
            foreach (var item in row.Ingredients)
            {
                if (item is null || string.IsNullOrWhiteSpace(item.Name) || item.Name.Length > 150 ||
                    item.Unit is not ("g" or "kg" or "ml" or "l" or "tsp" or "tbsp" or "piece") ||
                    item.Quantity is <= 0 or > 999999999.999m || decimal.Round(item.Quantity, 3) != item.Quantity)
                    throw new InvalidOperationException($"Invalid ingredient: {row.DatasetKey}");
                var (_, normalizedIngredient) = CanonizeIngredient(item.Name);
                if (!recipeIngredients.Add(normalizedIngredient))
                    throw new InvalidOperationException($"Duplicate ingredient in recipe: {row.DatasetKey}");
            }
            if (row.Steps.Any(step => string.IsNullOrWhiteSpace(step) || step.Length > 5000))
                throw new InvalidOperationException($"Invalid step: {row.DatasetKey}");
        }
        return rows;
    }

    private static string Hash(string value) => Convert.ToHexStringLower(SHA256.HashData(Encoding.UTF8.GetBytes(value)));

    public static async Task<DatasetImportResult> ImportAsync(RecipeHubDbContext db, string json, Guid authorId, CancellationToken ct = default)
    {
        var rows = Read(json);
        await using var transaction = await db.Database.BeginTransactionAsync(ct);
        await db.Database.ExecuteSqlRawAsync("SELECT pg_advisory_xact_lock(72100403)", ct);
        if (!await db.Users.AnyAsync(user => user.Id == authorId, ct)) throw new InvalidOperationException("Import author does not exist.");
        var created = 0;
        var skipped = 0;
        foreach (var row in rows)
        {
            var hash = Hash(JsonSerializer.Serialize(row, HashJsonOptions));
            var existing = await db.Set<RecipeDatasetEntry>().SingleOrDefaultAsync(entry => entry.DatasetKey == row.DatasetKey, ct);
            if (existing is not null)
            {
                if (existing.ContentHash != hash) throw new InvalidOperationException($"Dataset content conflict: {row.DatasetKey}");
                skipped++;
                continue;
            }
            var slug = "dataset-" + row.DatasetKey;
            if (await db.Recipes.AnyAsync(recipe => recipe.Slug == slug, ct)) throw new InvalidOperationException($"Recipe slug conflict: {row.DatasetKey}");
            var categoryName = row.Category.Trim().Normalize();
            var categorySlug = "dataset-" + Hash(categoryName.ToLowerInvariant())[..24];
            var category = await db.Categories.SingleOrDefaultAsync(item => item.Slug == categorySlug, ct);
            if (category is null) { category = new Category { Name = categoryName, Slug = categorySlug }; db.Add(category); }
            var description = string.IsNullOrWhiteSpace(row.Description)
                ? "Bản nháp dữ liệu đang chờ kiểm chứng."
                : row.Description.Trim().Normalize();
            var recipe = new Recipe
            {
                Title = row.Title.Trim().Normalize(), Slug = slug, Description = description,
                AuthorId = authorId, Servings = row.Servings, PrepMinutes = row.PrepMinutes, CookMinutes = row.CookMinutes,
                Status = "Draft", CreatedAt = DateTimeOffset.UtcNow, UpdatedAt = DateTimeOffset.UtcNow
            };
            foreach (var item in row.Ingredients)
            {
                var (name, normalized) = CanonizeIngredient(item.Name);
                var ingredient = await db.Ingredients.SingleOrDefaultAsync(value => value.NormalizedName == normalized, ct);
                if (ingredient is null)
                {
                    ingredient = db.Ingredients.Local.FirstOrDefault(value => value.NormalizedName == normalized);
                    if (ingredient is null) { ingredient = new Ingredient { Name = name, NormalizedName = normalized, DefaultUnit = item.Unit }; db.Add(ingredient); }
                }
                recipe.Ingredients.Add(new RecipeIngredient { RecipeId = recipe.Id, IngredientId = ingredient.Id,
                    Quantity = item.Quantity, Unit = item.Unit, Position = recipe.Ingredients.Count + 1 });
            }
            recipe.Steps = row.Steps.Select((step, index) => new RecipeStep { RecipeId = recipe.Id, Position = index + 1, Instruction = step.Trim() }).ToList();
            recipe.Categories.Add(new RecipeCategory { RecipeId = recipe.Id, CategoryId = category.Id });
            db.Add(recipe);
            db.Add(new RecipeDatasetEntry { RecipeId = recipe.Id, DatasetKey = row.DatasetKey, ContentHash = hash,
                SourceType = row.Source.Type, ReviewStatus = "Pending", ImportedAt = DateTimeOffset.UtcNow });
            await db.SaveChangesAsync(ct);
            created++;
        }
        await transaction.CommitAsync(ct);
        return new(created, skipped);
    }
}
