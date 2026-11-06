using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace RecipeHub.Infrastructure.Persistence;

// Offline factory: generates/reviews migrations without loading application secrets.
// No connection string is supplied, so this factory cannot update a database by default.
public sealed class RecipeHubDbContextFactory : IDesignTimeDbContextFactory<RecipeHubDbContext>
{
    public RecipeHubDbContext CreateDbContext(string[] args)
    {
        var options = new DbContextOptionsBuilder<RecipeHubDbContext>()
            .UseNpgsql()
            .Options;
        return new RecipeHubDbContext(options);
    }
}
