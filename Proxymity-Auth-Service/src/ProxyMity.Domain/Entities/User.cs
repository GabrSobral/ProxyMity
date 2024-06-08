namespace ProxyMity.Domain.Entities;

/// <summary>
/// The user entity, this entity represents each user at application.
/// </summary>
[Table("user")]
public class User
{
    [Key]
    public required Ulid Id { get; set; }
    public required string FirstName { get; set; }
    public string LastName { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public DateTime? LastOnline { get; set; }
    public required DateTime CreatedAt { get; set; }
    public string? PhotoUrl { get; set; }

    #region Foreign Keys

    public IEnumerable<RefreshToken> RefreshTokens { get; set; }

    #endregion

    public static User Create(string firstName, string lastName, string email, string passwordHash)
    {
        return new User
        {
            Id = Ulid.NewUlid(),
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            PasswordHash = passwordHash,
            CreatedAt = DateTime.UtcNow,
        };
    }
}
