namespace ProxyMity.Application.Authentication;

/// <summary>
/// Implementation of IJsonWebToken contract
/// </summary>
/// <remarks>
/// JWT constructor responsible for injection dependencies to implementation
/// </remarks>
/// <param name="logger">Logger of class</param>
/// <param name="options">Jwt Options, injected by configuration using IOptions, and abstracted to a class</param>
public class JsonWebToken(ILogger<JsonWebToken> logger, IOptions<JwtOptions> options) : IJsonWebToken
{
    private readonly JwtOptions _jwtOptions = options.Value;

    /// <summary>
    /// Method that generate a valid Json Web Token, using user data and HS256
    /// </summary>
    /// <param name="user">User Domain instance</param>
    /// <returns>Token string</returns>
    public string Sign(User user)
    {
        logger.LogInformation($"Creating a new token to {user.Email}");

        var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.SecretKey));
        var signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);

        var claims = new Claim[] {
            new (JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new (JwtRegisteredClaimNames.Name, user.Name),
            new (JwtRegisteredClaimNames.Email, user.Email),
        };

        var token = new JwtSecurityToken(
            issuer: _jwtOptions.Issuer,
            audience: _jwtOptions.Audience,
            claims: claims,
            null,
            expires: DateTime.UtcNow.AddMinutes(_jwtOptions.ExpireMinutes),
            signingCredentials: signingCredentials
        );

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        return tokenString;
    }
}
