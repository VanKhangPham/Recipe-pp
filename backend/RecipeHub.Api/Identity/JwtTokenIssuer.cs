using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using RecipeHub.Application.Identity;

namespace RecipeHub.Api.Identity;

public sealed record JwtSettings(string Issuer, string Audience, string Key);

public sealed class JwtTokenIssuer(JwtSettings settings, TimeProvider clock) : IAccessTokenIssuer
{
    public AccessToken Issue(UserProfile user)
    {
        var now = clock.GetUtcNow();
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };
        claims.AddRange(user.Roles.Select(role => new Claim(ClaimTypes.Role, role)));
        var token = new JwtSecurityToken(settings.Issuer, settings.Audience, claims,
            notBefore: now.UtcDateTime, expires: now.AddMinutes(15).UtcDateTime,
            signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings.Key)), SecurityAlgorithms.HmacSha256));
        return new AccessToken(new JwtSecurityTokenHandler().WriteToken(token), 900);
    }
}
