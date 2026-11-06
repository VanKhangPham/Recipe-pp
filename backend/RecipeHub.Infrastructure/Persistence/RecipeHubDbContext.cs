using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RecipeHub.Domain.Recipes;
using RecipeHub.Infrastructure.Identity;

namespace RecipeHub.Infrastructure.Persistence;

public sealed class RecipeHubDbContext(DbContextOptions<RecipeHubDbContext> options)
    : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>(options)
{
    public DbSet<Recipe> Recipes => Set<Recipe>();
    public DbSet<Ingredient> Ingredients => Set<Ingredient>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder model)
    {
        base.OnModelCreating(model);
        model.ConfigureFeatures();
        model.Entity<RecipeDatasetEntry>(b =>
        {
            b.ToTable("RecipeDatasetEntries", table =>
                table.HasCheckConstraint("CK_Dataset_ReviewStatus", "\"ReviewStatus\" IN ('Pending','Approved','Rejected')"));
            b.HasKey(x => x.RecipeId);
            b.HasOne<Recipe>().WithOne().HasForeignKey<RecipeDatasetEntry>(x => x.RecipeId).OnDelete(DeleteBehavior.Cascade);
            b.Property(x => x.DatasetKey).HasMaxLength(150).IsRequired();
            b.HasIndex(x => x.DatasetKey).IsUnique();
            b.Property(x => x.ContentHash).HasMaxLength(64).IsRequired();
            b.Property(x => x.SourceType).HasMaxLength(100).IsRequired();
            b.Property(x => x.SourceName).HasMaxLength(200);
            b.Property(x => x.SourceUrl).HasMaxLength(2048);
            b.Property(x => x.LicenseIdentifier).HasMaxLength(100);
            b.Property(x => x.ReviewStatus).HasMaxLength(20).IsRequired();
        });
        model.Entity<ApplicationUser>(b =>
        {
            b.Property(x => x.DisplayName).HasMaxLength(100).IsRequired();
            b.Property(x => x.Email).HasMaxLength(254).IsRequired();
            b.Property(x => x.NormalizedEmail).HasMaxLength(254).IsRequired();
            b.HasIndex(x => x.NormalizedEmail).IsUnique();
        });
        model.Entity<RefreshToken>(b =>
        {
            b.ToTable("RefreshTokens", t => t.HasCheckConstraint("CK_RefreshToken_Expiry", "\"ExpiresAt\" > \"CreatedAt\""));
            b.Property(x => x.TokenHash).HasMaxLength(64).IsRequired();
            b.HasIndex(x => x.TokenHash).IsUnique();
            b.HasIndex(x => new { x.UserId, x.ExpiresAt });
            b.HasIndex(x => x.FamilyId);
            b.HasOne<ApplicationUser>().WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
            b.HasOne<RefreshToken>().WithMany().HasForeignKey(x => x.ReplacedByTokenId).OnDelete(DeleteBehavior.Restrict);
        });
        model.Entity<Recipe>(b =>
        {
            b.ToTable("Recipes", t =>
            {
                t.HasCheckConstraint("CK_Recipe_Servings", "\"Servings\" > 0");
                t.HasCheckConstraint("CK_Recipe_Times", "\"PrepMinutes\" >= 0 AND \"CookMinutes\" >= 0");
                t.HasCheckConstraint("CK_Recipe_Difficulty", "\"Difficulty\" IN ('Easy','Medium','Hard')");
                t.HasCheckConstraint("CK_Recipe_Status", "\"Status\" IN ('Draft','Published','Archived')");
                t.HasCheckConstraint("CK_Recipe_PublishedAt", "\"Status\" <> 'Published' OR \"PublishedAt\" IS NOT NULL");
            });
            b.Property(x => x.Title).HasMaxLength(200).IsRequired();
            b.Property(x => x.Slug).HasMaxLength(240).IsRequired();
            b.Property(x => x.Description).IsRequired();
            b.Property(x => x.Difficulty).HasMaxLength(10).IsRequired();
            b.Property(x => x.Status).HasMaxLength(12).IsRequired();
            b.HasIndex(x => x.Slug).IsUnique();
            b.HasIndex(x => new { x.Status, x.CreatedAt, x.Id }).IsDescending(false, true, false);
            b.HasIndex(x => new { x.Status, x.PublishedAt, x.Id }).IsDescending(false, true, false);
            b.HasIndex(x => new { x.AuthorId, x.UpdatedAt, x.Id }).IsDescending(false, true, false);
            b.HasOne<ApplicationUser>().WithMany().HasForeignKey(x => x.AuthorId).OnDelete(DeleteBehavior.Restrict);
            b.HasMany(x => x.Steps).WithOne().HasForeignKey(x => x.RecipeId).OnDelete(DeleteBehavior.Cascade);
            b.HasMany(x => x.Ingredients).WithOne().HasForeignKey(x => x.RecipeId).OnDelete(DeleteBehavior.Cascade);
            b.HasMany(x => x.Images).WithOne().HasForeignKey(x => x.RecipeId).OnDelete(DeleteBehavior.Cascade);
            b.HasMany(x => x.Categories).WithOne().HasForeignKey(x => x.RecipeId).OnDelete(DeleteBehavior.Cascade);
            // PostgreSQL-specific generated vector, weighted title A / description B.
            b.Property<NpgsqlTypes.NpgsqlTsVector>("SearchVector")
                .HasComputedColumnSql("setweight(to_tsvector('simple'::regconfig, coalesce(\"Title\", '')), 'A') || setweight(to_tsvector('simple'::regconfig, coalesce(\"Description\", '')), 'B')", stored: true);
            b.HasIndex("SearchVector").HasMethod("GIN");
        });
        model.Entity<RecipeStep>(b =>
        {
            b.ToTable("RecipeSteps", t =>
            {
                t.HasCheckConstraint("CK_Step_Position", "\"Position\" > 0");
                t.HasCheckConstraint("CK_Step_Duration", "\"DurationMinutes\" IS NULL OR \"DurationMinutes\" >= 0");
            });
            b.Property(x => x.Instruction).IsRequired();
            b.HasIndex(x => new { x.RecipeId, x.Position }).IsUnique();
        });
        model.Entity<Ingredient>(b =>
        {
            b.ToTable("Ingredients");
            b.Property(x => x.Name).HasMaxLength(150).IsRequired();
            b.Property(x => x.NormalizedName).HasMaxLength(150).IsRequired();
            b.Property(x => x.DefaultUnit).HasMaxLength(20).IsRequired();
            b.HasIndex(x => x.NormalizedName).IsUnique();
        });
        model.Entity<RecipeIngredient>(b =>
        {
            b.ToTable("RecipeIngredients", t =>
            {
                t.HasCheckConstraint("CK_RecipeIngredient_Quantity", "\"Quantity\" > 0");
                t.HasCheckConstraint("CK_RecipeIngredient_Position", "\"Position\" > 0");
            });
            b.Property(x => x.Quantity).HasPrecision(12, 3);
            b.Property(x => x.Unit).HasMaxLength(20).IsRequired();
            b.Property(x => x.Note).HasMaxLength(300);
            b.HasIndex(x => new { x.RecipeId, x.Position }).IsUnique();
            b.HasIndex(x => new { x.IngredientId, x.RecipeId });
            b.HasOne<Ingredient>().WithMany().HasForeignKey(x => x.IngredientId).OnDelete(DeleteBehavior.Restrict);
        });
        model.Entity<RecipeImage>(b =>
        {
            b.ToTable("RecipeImages", t => t.HasCheckConstraint("CK_Image_Position", "\"Position\" >= 0"));
            b.Property(x => x.Url).HasMaxLength(2048).IsRequired();
            b.Property(x => x.AltText).HasMaxLength(200).IsRequired();
            b.HasIndex(x => new { x.RecipeId, x.Position }).IsUnique();
        });
        model.Entity<Category>(b =>
        {
            b.ToTable("Categories");
            b.Property(x => x.Name).HasMaxLength(100).IsRequired();
            b.Property(x => x.Slug).HasMaxLength(120).IsRequired();
            b.HasIndex(x => x.Slug).IsUnique();
        });
        model.Entity<RecipeCategory>(b =>
        {
            b.ToTable("RecipeCategories");
            b.HasKey(x => new { x.RecipeId, x.CategoryId });
            b.HasIndex(x => new { x.CategoryId, x.RecipeId });
            b.HasOne<Category>().WithMany().HasForeignKey(x => x.CategoryId).OnDelete(DeleteBehavior.Restrict);
        });
    }
}
