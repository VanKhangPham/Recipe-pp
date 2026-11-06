namespace RecipeHub.Domain.Recipes;

public sealed class RecipeDatasetEntry
{
    public Guid RecipeId { get; set; }
    public string DatasetKey { get; set; } = string.Empty;
    public string ContentHash { get; set; } = string.Empty;
    public string SourceType { get; set; } = string.Empty;
    public string? SourceName { get; set; }
    public string? SourceUrl { get; set; }
    public string? LicenseIdentifier { get; set; }
    public string ReviewStatus { get; set; } = "Pending";
    public DateTimeOffset ImportedAt { get; set; }
}
