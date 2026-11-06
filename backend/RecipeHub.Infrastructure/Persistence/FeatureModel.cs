using Microsoft.EntityFrameworkCore;
using RecipeHub.Domain.Features;
using RecipeHub.Domain.Recipes;
using RecipeHub.Infrastructure.Identity;

namespace RecipeHub.Infrastructure.Persistence;

internal static class FeatureModel
{
    public static void ConfigureFeatures(this ModelBuilder model)
    {
        model.Entity<Tag>(b =>
        {
            b.ToTable("Tags"); b.Property(x => x.Name).HasMaxLength(100); b.Property(x => x.Slug).HasMaxLength(120);
            b.HasIndex(x => x.Slug).IsUnique();
        });
        model.Entity<RecipeTag>(b =>
        {
            b.ToTable("RecipeTags"); b.HasKey(x => new { x.RecipeId, x.TagId });
            b.HasOne<Recipe>().WithMany().HasForeignKey(x => x.RecipeId).OnDelete(DeleteBehavior.Cascade);
            b.HasOne<Tag>().WithMany().HasForeignKey(x => x.TagId).OnDelete(DeleteBehavior.Restrict);
            b.HasIndex(x => new { x.TagId, x.RecipeId });
        });
        model.Entity<NutritionFacts>(b =>
        {
            b.ToTable("NutritionFacts", t => t.HasCheckConstraint("CK_Nutrition_NonNegative",
                "(\"Calories\" IS NULL OR \"Calories\" >= 0) AND (\"ProteinGrams\" IS NULL OR \"ProteinGrams\" >= 0) AND (\"CarbsGrams\" IS NULL OR \"CarbsGrams\" >= 0) AND (\"FatGrams\" IS NULL OR \"FatGrams\" >= 0)"));
            b.HasKey(x => x.RecipeId); b.Property(x => x.Source).HasMaxLength(200);
            foreach (var name in new[] { "Calories", "ProteinGrams", "CarbsGrams", "FatGrams" }) b.Property<decimal?>(name).HasPrecision(12, 3);
            b.HasOne<Recipe>().WithOne().HasForeignKey<NutritionFacts>(x => x.RecipeId).OnDelete(DeleteBehavior.Cascade);
        });
        model.Entity<Favorite>(b =>
        {
            b.ToTable("Favorites"); b.HasKey(x => new { x.UserId, x.RecipeId }); b.HasIndex(x => x.RecipeId);
            b.HasOne<ApplicationUser>().WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
            b.HasOne<Recipe>().WithMany().HasForeignKey(x => x.RecipeId).OnDelete(DeleteBehavior.Cascade);
        });
        model.Entity<Review>(b =>
        {
            b.ToTable("Reviews", t =>
            {
                t.HasCheckConstraint("CK_Review_Rating", "\"Rating\" BETWEEN 1 AND 5");
                t.HasCheckConstraint("CK_Review_Status", "\"ModerationStatus\" IN ('Pending','Visible','Hidden')");
            });
            b.Property(x => x.Comment).HasMaxLength(2000); b.Property(x => x.ModerationStatus).HasMaxLength(10);
            b.HasIndex(x => new { x.UserId, x.RecipeId }).IsUnique();
            b.HasIndex(x => new { x.RecipeId, x.ModerationStatus, x.CreatedAt, x.Id });
            b.HasOne<ApplicationUser>().WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Restrict);
            b.HasOne<Recipe>().WithMany().HasForeignKey(x => x.RecipeId).OnDelete(DeleteBehavior.Cascade);
        });
        model.Entity<RecipeView>(b =>
        {
            b.ToTable("RecipeViews"); b.HasIndex(x => new { x.RecipeId, x.ViewedAt }); b.HasIndex(x => new { x.UserId, x.ViewedAt });
            b.HasOne<ApplicationUser>().WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.SetNull);
            b.HasOne<Recipe>().WithMany().HasForeignKey(x => x.RecipeId).OnDelete(DeleteBehavior.Cascade);
        });
        model.Entity<UserPreference>(b =>
        {
            b.ToTable("UserPreferences", t => t.HasCheckConstraint("CK_Preferences_Time", "\"PreferredMaxCookingMinutes\" IS NULL OR \"PreferredMaxCookingMinutes\" > 0"));
            b.HasKey(x => x.UserId); b.Property(x => x.DietaryPreferences).HasColumnType("jsonb"); b.Property(x => x.Allergens).HasColumnType("jsonb");
            b.HasOne<ApplicationUser>().WithOne().HasForeignKey<UserPreference>(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
        });
        model.Entity<MealPlan>(b =>
        {
            b.ToTable("MealPlans", t => t.HasCheckConstraint("CK_MealPlan_Monday", "extract(isodow from \"WeekStart\") = 1"));
            b.HasAlternateKey(x => new { x.Id, x.UserId }); b.HasIndex(x => new { x.UserId, x.WeekStart }).IsUnique();
            b.HasOne<ApplicationUser>().WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Restrict);
            b.HasMany(x => x.Items).WithOne().HasForeignKey(x => x.MealPlanId).OnDelete(DeleteBehavior.Cascade);
        });
        model.Entity<MealPlanItem>(b =>
        {
            b.ToTable("MealPlanItems", t =>
            {
                t.HasCheckConstraint("CK_MealItem_Servings", "\"Servings\" > 0");
                t.HasCheckConstraint("CK_MealItem_Type", "\"MealType\" IN ('Breakfast','Lunch','Dinner','Snack')");
            });
            b.Property(x => x.MealType).HasMaxLength(10);
            b.HasIndex(x => new { x.MealPlanId, x.PlannedDate, x.MealType, x.RecipeId }).IsUnique();
            b.HasIndex(x => new { x.MealPlanId, x.PlannedDate });
            b.HasOne<Recipe>().WithMany().HasForeignKey(x => x.RecipeId).OnDelete(DeleteBehavior.Restrict);
        });
        model.Entity<ShoppingList>(b =>
        {
            b.ToTable("ShoppingLists"); b.Property(x => x.Name).HasMaxLength(150);
            b.HasIndex(x => x.MealPlanId).IsUnique().HasFilter("\"MealPlanId\" IS NOT NULL");
            b.HasOne<ApplicationUser>().WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Restrict);
            b.HasOne<MealPlan>().WithMany().HasForeignKey(x => new { x.MealPlanId, x.UserId })
                .HasPrincipalKey(x => new { x.Id, x.UserId }).OnDelete(DeleteBehavior.Restrict);
            b.HasMany(x => x.Items).WithOne().HasForeignKey(x => x.ShoppingListId).OnDelete(DeleteBehavior.Cascade);
        });
        model.Entity<ShoppingListItem>(b =>
        {
            b.ToTable("ShoppingListItems", t => t.HasCheckConstraint("CK_ShoppingItem_Quantity", "\"Quantity\" > 0"));
            b.Property(x => x.Quantity).HasPrecision(12, 3); b.Property(x => x.Unit).HasMaxLength(20); b.Property(x => x.Note).HasMaxLength(300);
            b.HasIndex(x => new { x.ShoppingListId, x.IngredientId, x.Unit }).IsUnique();
            b.HasOne<Ingredient>().WithMany().HasForeignKey(x => x.IngredientId).OnDelete(DeleteBehavior.Restrict);
        });
        model.Entity<AuditLog>(b =>
        {
            b.ToTable("AuditLogs"); b.Property(x => x.Action).HasMaxLength(100); b.Property(x => x.EntityType).HasMaxLength(100); b.Property(x => x.EntityId).HasMaxLength(100);
            b.HasIndex(x => x.OccurredAt); b.HasIndex(x => new { x.ActorUserId, x.OccurredAt });
            b.HasOne<ApplicationUser>().WithMany().HasForeignKey(x => x.ActorUserId).OnDelete(DeleteBehavior.SetNull);
        });
    }
}
