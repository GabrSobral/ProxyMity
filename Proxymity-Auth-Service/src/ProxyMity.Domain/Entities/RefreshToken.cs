namespace ProxyMity.Domain.Entities;

/// <summary>
/// The refresh token entity, this entity represents the refresh 
/// token instance at application.
/// </summary>
[Table("refresh_token")]
public class RefreshToken
{
    [Key]
    public required Guid Id { get; set; }
    public required Guid UserId { get; set; }
    public required ushort AvailableRefreshes { get; set; }
    public required DateTime ExpiryDate { get; set; }
    public required DateTime CreatedAt { get; set; }

    #region Foreign Keys

    [ForeignKey(nameof(UserId))]
    public User User { get; set; }

    #endregion

    public static RefreshToken Create(ushort availableRefreshes, Guid userId, DateTime expiryDate)
    {
        return new RefreshToken
        {
            Id = Guid.CreateVersion7(),
            UserId = userId,
            AvailableRefreshes = availableRefreshes,
            ExpiryDate = expiryDate,
            CreatedAt = DateTime.UtcNow
        };
    }
}
