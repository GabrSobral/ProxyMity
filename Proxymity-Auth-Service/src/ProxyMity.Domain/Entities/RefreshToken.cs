namespace ProxyMity.Domain.Entities;

/// <summary>
/// The refresh token entity, this entity represents the refresh 
/// token instance at application.
/// </summary>
[Table("refresh_token")]
public class RefreshToken
{
    [Key]
    public required Ulid Id { get; set; }
    public required Ulid UserId { get; set; }
    public required string Token { get; set; }
    public required DateTime ExpiryDate { get; set; }
    public required DateTime CreatedAt { get; set; }

    #region Foreign Keys

    [ForeignKey(nameof(UserId))]
    public User User { get; set; }

    #endregion

    public static RefreshToken Create(string token, Ulid userId, DateTime expiryDate)
    {
        return new RefreshToken
        {
            Id = Ulid.NewUlid(),
            UserId = userId,
            Token = token,
            ExpiryDate = expiryDate,
            CreatedAt = DateTime.UtcNow
        };
    }
}
