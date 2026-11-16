using System.ComponentModel.DataAnnotations;

namespace RecipeHub.Application.Identity;

public sealed record RegisterRequest(
    [Required, EmailAddress, MaxLength(254)] string Email,
    [Required, StringLength(128, MinimumLength = 12)] string Password,
    [Required, StringLength(100, MinimumLength = 1)] string DisplayName);

public sealed record LoginRequest(
    [Required, EmailAddress, MaxLength(254)] string Email,
    [Required, MaxLength(128)] string Password);

public sealed record UpdateProfileRequest(
    [Required, StringLength(100, MinimumLength = 1)] string DisplayName);

public sealed record UserProfile(Guid Id, string Email, string DisplayName, string[] Roles, DateTimeOffset CreatedAt);
public sealed record AccessToken(string Value, int ExpiresIn);
public sealed record AuthSession(AccessToken AccessToken, UserProfile User, string RefreshToken, DateTimeOffset RefreshExpiresAt);
public sealed record TokenResponse(string AccessToken, string TokenType, int ExpiresIn, UserProfile User);

public enum AuthError { Validation, Conflict, Unauthorized, NotFound }

public sealed class AuthException(AuthError error, string message,
    Dictionary<string, string[]>? errors = null) : Exception(message)
{
    public AuthError Error { get; } = error;
    public Dictionary<string, string[]>? Errors { get; } = errors;
}

public interface IAccessTokenIssuer
{
    AccessToken Issue(UserProfile user);
}

public interface IAuthService
{
    Task<UserProfile> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken);
    Task<AuthSession> LoginAsync(LoginRequest request, CancellationToken cancellationToken);
    Task<AuthSession> RefreshAsync(string refreshToken, CancellationToken cancellationToken);
    Task LogoutAsync(string? refreshToken, CancellationToken cancellationToken);
    Task<UserProfile> GetProfileAsync(Guid userId, CancellationToken cancellationToken);
    Task<UserProfile> UpdateProfileAsync(Guid userId, UpdateProfileRequest request, CancellationToken cancellationToken);
}
