namespace ProxyMity.Application.Authentication;

public class JsonWebToken : IJsonWebToken
{
    private readonly byte[] _secret;
    private readonly int _expireMinutes = 45;
    private readonly ILogger<JsonWebToken> _logger;

    public JsonWebToken(ILogger<JsonWebToken> logger, IConfiguration configuration)
    {
        _logger = logger;

        var secretString = configuration.GetSection("JwtSecret").Value
            ?? throw new NoJwtSecretWasProvidedException();

        _secret = Encoding.UTF8.GetBytes(secretString);
    }

    public string Sign(User user)
    {
        _logger.LogInformation($"Creating a new token to {user.Email}");

        var symmetricSecurityKey = new SymmetricSecurityKey(_secret);
        var signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256Signature);

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Email, user.Email),
        };

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_expireMinutes),
            signingCredentials: signingCredentials
        );

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        return tokenString;
    }

    public bool Validate(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();

        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(_secret),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };

        try
        {
            SecurityToken validatedToken;
            ClaimsPrincipal claimsPrincipal = tokenHandler.ValidateToken(token, tokenValidationParameters, out validatedToken);

            return true;
        }
        catch (Exception error)
        {
            _logger.LogError($"Invalid token: {error.Message}");

            return false;
        }
    }
}
