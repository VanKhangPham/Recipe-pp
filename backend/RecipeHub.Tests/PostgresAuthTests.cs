using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.AspNetCore.TestHost;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Npgsql;
using RecipeHub.Application.Identity;
using RecipeHub.Infrastructure.Persistence;
using Xunit;

namespace RecipeHub.Tests;

public sealed class PostgresFactAttribute : FactAttribute
{
    public PostgresFactAttribute()
    {
        if (Environment.GetEnvironmentVariable("RECIPEHUB_RUN_POSTGRES_TESTS") != "1")
            Skip = "Opt-in: set RECIPEHUB_RUN_POSTGRES_TESTS=1 and configure a development/test database. Uses an isolated temporary schema.";
    }
}

// Creates a fresh schema owned only by this test run; never migrates or clears public/learning.
public sealed class PostgresAuthFixture : IAsyncLifetime
{
    private readonly string _schema = "recipehub_test_" + Guid.NewGuid().ToString("N");
    private string? _connection;
    private bool _created;
    public string IsolatedConnection { get; private set; } = string.Empty;
    public WebApplicationFactory<Program> Factory { get; private set; } = null!;

    public async Task InitializeAsync()
    {
        if (Environment.GetEnvironmentVariable("RECIPEHUB_RUN_POSTGRES_TESTS") != "1") return;
        var config = new ConfigurationBuilder().AddUserSecrets("recipehub-api-development").Build();
        _connection = Environment.GetEnvironmentVariable("RECIPEHUB_POSTGRES_CONNECTION")
            ?? config.GetConnectionString("DefaultConnection");
        if (string.IsNullOrWhiteSpace(_connection)) throw new InvalidOperationException("Configure a development/test connection locally; never pass credentials in test arguments.");
        var builder = new NpgsqlConnectionStringBuilder(_connection);
        if (builder.Database != "recipehub_dev" && !(builder.Database?.EndsWith("_test", StringComparison.Ordinal) ?? false))
            throw new InvalidOperationException("PostgreSQL tests only accept recipehub_dev or a database ending in _test.");
        await using var connection = new NpgsqlConnection(_connection);
        await connection.OpenAsync();
        await using (var create = new NpgsqlCommand($"CREATE SCHEMA \"{_schema}\"", connection))
            await create.ExecuteNonQueryAsync();
        _created = true;
        try
        {
            builder.SearchPath = _schema;
            builder.IncludeErrorDetail = false;
            builder.Pooling = false;
            IsolatedConnection = builder.ConnectionString;
            await using var context = new RecipeHubDbContext(new DbContextOptionsBuilder<RecipeHubDbContext>()
                .UseNpgsql(IsolatedConnection).AddInterceptors(new TestSchemaInterceptor(_schema)).Options);
            await context.Database.MigrateAsync();
            Factory = new TestApiFactory().WithWebHostBuilder(host =>
            {
                host.ConfigureAppConfiguration((_, configuration) => configuration.AddInMemoryCollection(
                    new Dictionary<string, string?> { ["ConnectionStrings:DefaultConnection"] = IsolatedConnection }));
                host.ConfigureLogging(logging => logging.ClearProviders());
                host.ConfigureTestServices(services =>
                {
                    services.RemoveAll<IDbContextOptionsConfiguration<RecipeHubDbContext>>();
                    services.AddDbContext<RecipeHubDbContext>(options => options.UseNpgsql(IsolatedConnection).AddInterceptors(new TestSchemaInterceptor(_schema)));
                });
            });
            using var verification = Factory.Services.CreateScope();
            var actual = verification.ServiceProvider.GetRequiredService<RecipeHubDbContext>();
            var activeSchema = await actual.Database.SqlQueryRaw<string>("SELECT current_schema()::text AS \"Value\"").SingleAsync();
            if (activeSchema != _schema) throw new InvalidOperationException("Unexpected active test schema. Aborting before test writes.");
        }
        catch
        {
            await CleanupAsync();
            throw;
        }
    }

    public async Task DisposeAsync()
    {
        if (Factory is not null) await Factory.DisposeAsync();
        await CleanupAsync();
    }

    private async Task CleanupAsync()
    {
        if (!_created) return;
        // _schema is generated above, never accepted from configuration or user input.
        await using var connection = new NpgsqlConnection(_connection);
        await connection.OpenAsync();
        await using var drop = new NpgsqlCommand($"DROP SCHEMA \"{_schema}\" CASCADE", connection);
        await drop.ExecuteNonQueryAsync();
        _created = false;
    }

    public async Task<T> WithService<T>(Func<IAuthService, Task<T>> action)
    {
        using var scope = Factory.Services.CreateScope();
        return await action(scope.ServiceProvider.GetRequiredService<IAuthService>());
    }

    public RecipeHubDbContext OpenContext() => new(new DbContextOptionsBuilder<RecipeHubDbContext>()
        .UseNpgsql(IsolatedConnection).AddInterceptors(new TestSchemaInterceptor(_schema)).Options);

    public static RegisterRequest NewUser() => new($"test-{Guid.NewGuid():N}@example.test", "Test1!" + Guid.NewGuid().ToString("N"), "Integration user");
}

[CollectionDefinition("Postgres auth", DisableParallelization = true)]
public sealed class PostgresAuthCollection;

[Collection("Postgres auth")]
public sealed class PostgresAuthTests(PostgresAuthFixture fixture) : IClassFixture<PostgresAuthFixture>
{
    [PostgresFact]
    public async Task RealHttp_RegisterLoginAndCurrentUser_WorkAgainstPostgres()
    {
        using var client = fixture.Factory.CreateClient();
        var request = PostgresAuthFixture.NewUser();
        await AuthHttpTests.AddCsrfAsync(client);
        var registered = await client.PostAsJsonAsync("/api/v1/auth/register", request);
        Assert.Equal(HttpStatusCode.Created, registered.StatusCode);
        var login = await client.PostAsJsonAsync("/api/v1/auth/login", new LoginRequest(request.Email, request.Password));
        Assert.Equal(HttpStatusCode.OK, login.StatusCode);
        var token = await login.Content.ReadFromJsonAsync<TokenResponse>();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token!.AccessToken);
        var user = await client.GetFromJsonAsync<UserProfile>("/api/v1/users/me");
        Assert.Equal(request.Email, user!.Email);
        Assert.Equal(["User"], user.Roles);
        await using var db = fixture.OpenContext();
        var stored = await db.Users.SingleAsync(x => x.Id == user.Id);
        Assert.NotEqual(request.Password, stored.PasswordHash);
        Assert.False(string.IsNullOrWhiteSpace(stored.PasswordHash));
    }

    [PostgresFact]
    public async Task Registration_RejectsWeakPasswordAndCaseInsensitiveDuplicate()
    {
        var request = PostgresAuthFixture.NewUser();
        var weak = await Assert.ThrowsAsync<AuthException>(() => fixture.WithService(auth => auth.RegisterAsync(request with { Password = "short" }, default)));
        Assert.Equal(AuthError.Validation, weak.Error);
        await fixture.WithService(auth => auth.RegisterAsync(request, default));
        var duplicate = await Assert.ThrowsAsync<AuthException>(() => fixture.WithService(auth => auth.RegisterAsync(request with { Email = request.Email.ToUpperInvariant() }, default)));
        Assert.Equal(AuthError.Conflict, duplicate.Error);
        await using var db = fixture.OpenContext();
        Assert.Equal(1, await db.Users.CountAsync(x => x.NormalizedEmail == request.Email.ToUpperInvariant()));
    }

    [PostgresFact]
    public async Task FiveWrongPasswords_LockAccountAndRejectCorrectPassword()
    {
        var request = PostgresAuthFixture.NewUser();
        await fixture.WithService(auth => auth.RegisterAsync(request, default));
        for (var attempt = 0; attempt < 5; attempt++)
            await Assert.ThrowsAsync<AuthException>(() => fixture.WithService(auth => auth.LoginAsync(new LoginRequest(request.Email, "Wrong1!Password"), default)));
        var locked = await Assert.ThrowsAsync<AuthException>(() => fixture.WithService(auth => auth.LoginAsync(new LoginRequest(request.Email, request.Password), default)));
        Assert.Equal(AuthError.Unauthorized, locked.Error);
        await using var db = fixture.OpenContext();
        Assert.True((await db.Users.SingleAsync(x => x.Email == request.Email)).LockoutEnd > DateTimeOffset.UtcNow);
    }

    [PostgresFact]
    public async Task RefreshRotatesHash_AndReuseRevokesWholeFamily()
    {
        var initial = await RegisterAndLogin();
        var refreshed = await fixture.WithService(auth => auth.RefreshAsync(initial.RefreshToken, default));
        Assert.NotEqual(initial.RefreshToken, refreshed.RefreshToken);
        await using (var db = fixture.OpenContext())
        {
            var tokens = await db.RefreshTokens.Where(x => x.UserId == initial.User.Id).ToListAsync();
            Assert.Equal(2, tokens.Count);
            Assert.All(tokens, token => Assert.Equal(64, token.TokenHash.Length));
            Assert.DoesNotContain(tokens, token => token.TokenHash == initial.RefreshToken || token.TokenHash == refreshed.RefreshToken);
        }
        await Assert.ThrowsAsync<AuthException>(() => fixture.WithService(auth => auth.RefreshAsync(initial.RefreshToken, default)));
        await Assert.ThrowsAsync<AuthException>(() => fixture.WithService(auth => auth.RefreshAsync(refreshed.RefreshToken, default)));
    }

    [PostgresFact]
    public async Task ConcurrentRefresh_AllowsOneRotation_ThenRevokesFamilyOnReuse()
    {
        var initial = await RegisterAndLogin();
        async Task<AuthSession?> TryRefresh()
        {
            try { return await fixture.WithService(auth => auth.RefreshAsync(initial.RefreshToken, default)); }
            catch (AuthException exception) when (exception.Error == AuthError.Unauthorized) { return null; }
        }
        var results = await Task.WhenAll(TryRefresh(), TryRefresh());
        var success = Assert.Single(results, session => session is not null)!;
        await Assert.ThrowsAsync<AuthException>(() => fixture.WithService(auth => auth.RefreshAsync(success.RefreshToken, default)));
    }

    [PostgresFact]
    public async Task LogoutAndExpiredToken_RejectFurtherRefresh()
    {
        var initial = await RegisterAndLogin();
        await fixture.WithService(async auth => { await auth.LogoutAsync(initial.RefreshToken, default); return true; });
        await Assert.ThrowsAsync<AuthException>(() => fixture.WithService(auth => auth.RefreshAsync(initial.RefreshToken, default)));
        var other = await RegisterAndLogin();
        await using (var db = fixture.OpenContext())
        {
            var row = await db.RefreshTokens.SingleAsync(x => x.UserId == other.User.Id);
            row.CreatedAt = DateTimeOffset.UtcNow.AddDays(-10);
            row.ExpiresAt = DateTimeOffset.UtcNow.AddDays(-1);
            await db.SaveChangesAsync();
        }
        await Assert.ThrowsAsync<AuthException>(() => fixture.WithService(auth => auth.RefreshAsync(other.RefreshToken, default)));
    }

    private async Task<AuthSession> RegisterAndLogin()
    {
        var request = PostgresAuthFixture.NewUser();
        await fixture.WithService(auth => auth.RegisterAsync(request, default));
        return await fixture.WithService(auth => auth.LoginAsync(new LoginRequest(request.Email, request.Password), default));
    }
}


