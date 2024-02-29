namespace ProxyMity.Domain.Entities;

[Table("participant")]
public class Participant
{
    public required Ulid UserId { get; set; }

    public required Ulid ConversationId { get; set; }

    public required DateTime CreatedAt { get; set; }

    public DateTime? RemovedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? ConversationPinnedAt { get; set; }

    #region Foreign Keys

    [ForeignKey(nameof(UserId))]
    public User User { get; set; }

    [ForeignKey(nameof(ConversationId))]
    public Conversation Conversation { get; set; }

    #endregion

    public static Participant Create(Ulid userId, Ulid conversationId)
    {
        return new Participant
        {
            UserId = userId,
            ConversationId = conversationId,
            CreatedAt = DateTime.UtcNow,
        };
    }
}
