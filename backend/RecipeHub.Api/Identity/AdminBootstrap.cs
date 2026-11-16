using System.Text;
using RecipeHub.Application.Features;

namespace RecipeHub.Api.Identity;

internal static class AdminBootstrap
{
    public static async Task RunAsync(IServiceProvider provider)
    {
        if (Console.IsInputRedirected) throw new InvalidOperationException("Admin bootstrap requires an interactive terminal; do not pass credentials as arguments.");
        Console.Write("Admin email: "); var email = Console.ReadLine() ?? string.Empty;
        Console.Write("Display name: "); var name = Console.ReadLine() ?? string.Empty;
        Console.Write("Password (hidden): "); var password = new StringBuilder();
        while (true)
        {
            var key = Console.ReadKey(intercept: true);
            if (key.Key == ConsoleKey.Enter) break;
            if (key.Key == ConsoleKey.Backspace) { if (password.Length > 0) password.Length--; }
            else if (!char.IsControl(key.KeyChar)) password.Append(key.KeyChar);
        }
        Console.WriteLine();
        using var scope = provider.CreateScope();
        try
        {
            await scope.ServiceProvider.GetRequiredService<IAdministrationService>().BootstrapAdminAsync(email, password.ToString(), name, CancellationToken.None);
            Console.WriteLine("Admin account is ready. No access token was printed.");
        }
        finally { password.Clear(); }
    }
}
