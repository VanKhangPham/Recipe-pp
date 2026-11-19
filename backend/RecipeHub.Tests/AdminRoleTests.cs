using Microsoft.Extensions.DependencyInjection;
using RecipeHub.Application.Features;
using RecipeHub.Application.Identity;
using Xunit;

namespace RecipeHub.Tests;

[Collection("Postgres auth")]
public sealed class AdminRoleTests(PostgresAuthFixture fixture) : IClassFixture<PostgresAuthFixture>
{
    [PostgresFact]
    public async Task RoleChanges_RequireAdminAndPreserveAnActiveAdministrator()
    {
        var ownerRequest = PostgresAuthFixture.NewUser();
        var otherRequest = PostgresAuthFixture.NewUser();
        var owner = await fixture.WithService(auth => auth.RegisterAsync(ownerRequest, default));
        var other = await fixture.WithService(auth => auth.RegisterAsync(otherRequest, default));
        using var scope = fixture.Factory.Services.CreateScope();
        var administration = scope.ServiceProvider.GetRequiredService<IAdministrationService>();
        await administration.BootstrapAdminAsync(ownerRequest.Email, ownerRequest.Password, ownerRequest.DisplayName, default);
        await Assert.ThrowsAsync<AuthException>(() => administration.SetUserAdminAsync(other.Id, other.Id, true, default));
        var promoted = await administration.SetUserAdminAsync(owner.Id, other.Id, true, default);
        Assert.Contains("Admin", promoted.Roles);
        Assert.Contains("User", promoted.Roles);
        var demoted = await administration.SetUserAdminAsync(owner.Id, other.Id, false, default);
        Assert.DoesNotContain("Admin", demoted.Roles);
        Assert.Contains("User", demoted.Roles);
        await Assert.ThrowsAsync<AuthException>(() => administration.SetUserAdminAsync(other.Id, other.Id, true, default));
        // This test owns its schema, and bootstrapped exactly one active Admin.
        var denied = await Assert.ThrowsAsync<AuthException>(() => administration.SetUserAdminAsync(owner.Id, owner.Id, false, default));
        Assert.Equal(AuthError.Conflict, denied.Error);
    }
}
