namespace ProxyMity.Domain.Entities;

[Table("friendship")]
public class Friendship
{
    public Ulid RequesterId { get; set; }
    
    public Ulid TargetId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? AcceptedAt { get; set; }
    
    public DateTime? DeniedAt { get; set; }
    
    #region Foreign Keys
    
    [ForeignKey(nameof(RequesterId))]
    public User Requester { get; set; }
    
    [ForeignKey(nameof(TargetId))]
    public User Target { get; set; }
    
    #endregion

    public static Friendship Create(Ulid requesterId, Ulid targetId)
    {
        return new Friendship
        {
            TargetId = targetId,
            RequesterId = requesterId,
            CreatedAt = DateTime.UtcNow
        };
    }

    public DateTime Accept(Ulid userId)
    {
        if (userId != TargetId)
            throw new FriendshipCannotBeManagedByUserException(userId);

        var currentTime = DateTime.UtcNow;
        AcceptedAt = currentTime;

        return currentTime;
    }
    
    public DateTime Deny(Ulid userId)
    {
        if (userId != TargetId)
            throw new FriendshipCannotBeManagedByUserException(userId);

        var currentTime = DateTime.UtcNow;
        DeniedAt = currentTime;

        return currentTime;
    }
}