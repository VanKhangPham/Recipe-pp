using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RecipeHub.Infrastructure.Identity;
using RecipeHub.Infrastructure.Persistence;
using RecipeHub.Application.Identity;
using RecipeHub.Application.Recipes;
using RecipeHub.Infrastructure.Recipes;
using RecipeHub.Application.Features;
using RecipeHub.Infrastructure.Features;

namespace RecipeHub.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton(TimeProvider.System);
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<RecipeService>();
        services.AddScoped<IRecipeService>(provider => provider.GetRequiredService<RecipeService>());
        services.AddScoped<ISocialService, SocialService>();
        services.AddScoped<IPlanningService, PlanningService>();
        services.AddScoped<IAdministrationService, AdministrationService>();
        services.AddScoped<IRecommendationService, RecommendationService>();
        services.AddDbContext<RecipeHubDbContext>(options =>
        {
            var connection = configuration.GetConnectionString("DefaultConnection");
            if (string.IsNullOrWhiteSpace(connection))
            {
                throw new InvalidOperationException("Configure ConnectionStrings:DefaultConnection using User Secrets or environment variables.");
            }
            options.UseNpgsql(connection);
        });
        services.AddIdentityCore<ApplicationUser>(options =>
        {
            options.User.RequireUniqueEmail = true;
            options.Password.RequiredLength = 12;
            options.Password.RequireDigit = true;
            options.Password.RequireLowercase = true;
            options.Password.RequireUppercase = true;
            options.Password.RequireNonAlphanumeric = true;
            options.Lockout.MaxFailedAccessAttempts = 5;
            options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
        })
        .AddRoles<IdentityRole<Guid>>()
        .AddEntityFrameworkStores<RecipeHubDbContext>();
        services.AddHealthChecks().AddCheck<DatabaseReadinessCheck>("database", tags: ["ready"]);
        return services;
    }
}
