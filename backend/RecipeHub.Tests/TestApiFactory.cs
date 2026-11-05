using System.Security.Cryptography;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;

namespace RecipeHub.Tests;

public class TestApiFactory : WebApplicationFactory<Program>
{
    public static readonly string SigningKey = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Development");
        builder.ConfigureAppConfiguration((_, config) => config.AddInMemoryCollection(new Dictionary<string, string?>
        {
            ["Jwt:Key"] = SigningKey,
            ["ConnectionStrings:DefaultConnection"] = null
        }));
    }
}
