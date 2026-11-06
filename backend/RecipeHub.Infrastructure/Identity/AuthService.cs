using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using RecipeHub.Application.Identity;
using RecipeHub.Infrastructure.Persistence;

namespace RecipeHub.Infrastructure.Identity;

public sealed class AuthService(RecipeHubDbContext database, UserManager<ApplicationUser> users,
    RoleManager<IdentityRole<Guid>> roles, IAccessTokenIssuer issuer, TimeProvider clock) : IAuthService
{
    private static AuthException InvalidCredentials() => new(AuthError.Unauthorized, "Invalid credentials or session.");
    private DateTimeOffset Now => clock.GetUtcNow();

    public async Task<UserProfile> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken)
    {
        var email = request.Email.Trim();
        var displayName = request.DisplayName.Trim();
        if (displayName.Length == 0)
            throw new AuthException(AuthError.Validation, "Display name is required.", new() { ["displayName"] = ["Display name is required."] });

        await using var transaction = await database.Database.BeginTransactionAsync(cancellationToken);
        try
        {
            // Serializes creation of the shared default role across concurrent registrations.
            await database.Database.ExecuteSqlRawAsync("SELECT pg_advisory_xact_lock(72100401)", cancellationToken);
            if (!await roles.RoleExistsAsync("User"))
            {
                var roleResult = await roles.CreateAsync(new IdentityRole<Guid>("User") { Id = Guid.NewGuid() });
                if (!roleResult.Succeeded) throw new InvalidOperationException("Cannot initialize default role.");
            }
            var user = new ApplicationUser
            {
                Id = Guid.NewGuid(), UserName = email, Email = email, DisplayName = displayName,
                CreatedAt = Now, UpdatedAt = Now, LockoutEnabled = true
            };
            var result = await users.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                if (result.Errors.Any(e => e.Code is "DuplicateEmail" or "DuplicateUserName"))
                    throw new AuthException(AuthError.Conflict, "Email is already registered.");
                // Error codes are safe; Identity descriptions can contain submitted email/usernames.
                throw new AuthException(AuthError.Validation, "Registration validation failed.",
                    new() { ["registration"] = result.Errors.Select(e => e.Code).ToArray() });
            }
            if (!(await users.AddToRoleAsync(user, "User")).Succeeded)
                throw new InvalidOperationException("Cannot assign default role.");
            var profile = await ProfileAsync(user);
            await transaction.CommitAsync(cancellationToken);
            return profile;
        }
        catch (DbUpdateException exception) when (exception.InnerException is PostgresException { SqlState: PostgresErrorCodes.UniqueViolation })
        {
            throw new AuthException(AuthError.Conflict, "Email is already registered.");
        }
    }

    public async Task<AuthSession> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
    {
        var found = await users.FindByEmailAsync(request.Email.Trim());
        if (found is null) throw InvalidCredentials();
        await using var transaction = await database.Database.BeginTransactionAsync(cancellationToken);
        var user = await LockUserAsync(found.Id, cancellationToken);
        if (user is null || await users.IsLockedOutAsync(user)) throw InvalidCredentials();
        if (!await users.CheckPasswordAsync(user, request.Password))
        {
            if (!(await users.AccessFailedAsync(user)).Succeeded)
                throw new InvalidOperationException("Cannot update login attempt counter.");
            await transaction.CommitAsync(cancellationToken);
            throw InvalidCredentials();
        }
        if (!(await users.ResetAccessFailedCountAsync(user)).Succeeded)
            throw new InvalidOperationException("Cannot reset login attempt counter.");
        var session = await NewSessionAsync(user, Guid.NewGuid(), cancellationToken);
        await database.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);
        return session;
    }

    public async Task<AuthSession> RefreshAsync(string refreshToken, CancellationToken cancellationToken)
    {
        if (refreshToken.Length is < 32 or > 256) throw InvalidCredentials();
        var hash = Hash(refreshToken);
        var found = await database.RefreshTokens.AsNoTracking().SingleOrDefaultAsync(x => x.TokenHash == hash, cancellationToken);
        if (found is null) throw InvalidCredentials();
        await using var transaction = await database.Database.BeginTransactionAsync(cancellationToken);
        // User lock serializes login/refresh/logout for the account. Re-read token after acquiring it.
        var user = await LockUserAsync(found.UserId, cancellationToken);
        var token = await database.RefreshTokens.SingleAsync(x => x.Id == found.Id, cancellationToken);
        if (token.RevokedAt.HasValue)
        {
            await RevokeFamilyAsync(token.FamilyId, cancellationToken);
            await transaction.CommitAsync(cancellationToken);
            throw InvalidCredentials();
        }
        if (user is null || token.ExpiresAt <= Now || await users.IsLockedOutAsync(user))
        {
            await RevokeFamilyAsync(token.FamilyId, cancellationToken);
            await transaction.CommitAsync(cancellationToken);
            throw InvalidCredentials();
        }
        var session = await NewSessionAsync(user, token.FamilyId, cancellationToken);
        var replacementHash = Hash(session.RefreshToken);
        var replacement = database.RefreshTokens.Local.Single(x => x.TokenHash == replacementHash);
        token.RevokedAt = Now;
        // Persist the replacement before setting the self FK (Restrict).
        await database.SaveChangesAsync(cancellationToken);
        token.ReplacedByTokenId = replacement.Id;
        await database.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);
        return session;
    }

    public async Task LogoutAsync(string? refreshToken, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(refreshToken) || refreshToken.Length > 256) return;
        var hash = Hash(refreshToken);
        var token = await database.RefreshTokens.AsNoTracking().SingleOrDefaultAsync(x => x.TokenHash == hash, cancellationToken);
        if (token is null) return;
        await using var transaction = await database.Database.BeginTransactionAsync(cancellationToken);
        await LockUserAsync(token.UserId, cancellationToken);
        await RevokeFamilyAsync(token.FamilyId, cancellationToken);
        await transaction.CommitAsync(cancellationToken);
    }

    public async Task<UserProfile> GetProfileAsync(Guid userId, CancellationToken cancellationToken)
    {
        var user = await database.Users.SingleOrDefaultAsync(x => x.Id == userId, cancellationToken);
        if (user is null || await users.IsLockedOutAsync(user)) throw InvalidCredentials();
        return await ProfileAsync(user);
    }

    public async Task<UserProfile> UpdateProfileAsync(Guid userId, UpdateProfileRequest request, CancellationToken cancellationToken)
    {
        var name = request.DisplayName.Trim();
        if (name.Length == 0) throw new AuthException(AuthError.Validation, "Display name is required.", new() { ["displayName"] = ["Display name is required."] });
        await using var transaction = await database.Database.BeginTransactionAsync(cancellationToken);
        var user = await LockUserAsync(userId, cancellationToken);
        if (user is null || await users.IsLockedOutAsync(user)) throw InvalidCredentials();
        user.DisplayName = name;
        user.UpdatedAt = Now;
        if (!(await users.UpdateAsync(user)).Succeeded) throw new AuthException(AuthError.Conflict, "Profile update conflict.");
        var profile = await ProfileAsync(user);
        await transaction.CommitAsync(cancellationToken);
        return profile;
    }

    private async Task<ApplicationUser?> LockUserAsync(Guid id, CancellationToken cancellationToken)
    {
        // AsNoTracking avoids reusing a stale user loaded before another request updated lockout.
        var locked = await database.Users.FromSqlInterpolated($"SELECT * FROM \"AspNetUsers\" WHERE \"Id\" = {id} FOR UPDATE")
            .AsNoTracking().SingleOrDefaultAsync(cancellationToken);
        if (locked is null) return null;
        var existing = database.Users.Local.FirstOrDefault(x => x.Id == id);
        if (existing is not null) database.Entry(existing).State = EntityState.Detached;
        database.Attach(locked);
        return locked;
    }

    private Task<int> RevokeFamilyAsync(Guid familyId, CancellationToken cancellationToken) =>
        database.RefreshTokens.Where(x => x.FamilyId == familyId && x.RevokedAt == null)
            .ExecuteUpdateAsync(setters => setters.SetProperty(x => x.RevokedAt, (DateTimeOffset?)Now), cancellationToken);

    private async Task<AuthSession> NewSessionAsync(ApplicationUser user, Guid familyId, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        var profile = await ProfileAsync(user);
        var access = issuer.Issue(profile);
        var raw = Convert.ToHexString(RandomNumberGenerator.GetBytes(64));
        var expires = Now.AddDays(7);
        database.RefreshTokens.Add(new RefreshToken
        {
            Id = Guid.NewGuid(), UserId = user.Id, FamilyId = familyId, TokenHash = Hash(raw),
            CreatedAt = Now, ExpiresAt = expires
        });
        return new AuthSession(access, profile, raw, expires);
    }

    private async Task<UserProfile> ProfileAsync(ApplicationUser user) => new(user.Id, user.Email!, user.DisplayName,
        (await users.GetRolesAsync(user)).ToArray(), user.CreatedAt);

    internal static string Hash(string raw) => Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(raw)));
}
