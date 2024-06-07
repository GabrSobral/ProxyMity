namespace ProxyMity.Domain.Entities;

[Table("notification")]
public class Notification
{
    public Ulid Id { get; set; }
    public ENotificationType NotificationType { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime? ReadAt { get; set; }

    public Ulid UserId { get; set; }
    public Ulid ConversationId { get; set; }

    [ForeignKey(nameof(ConversationId))]
    public Conversation Conversation { get; set; }

    [ForeignKey(nameof(UserId))]
    public User User { get; set; }

    public static Notification Create(Ulid userId, Ulid conversationId, ENotificationType notificationType)
    {
        return new Notification { 
            Id = new Ulid(),
            UserId = userId,
            ConversationId = conversationId,
            NotificationType = notificationType,
            CreatedAt = DateTime.Now,
        };
    }
}
