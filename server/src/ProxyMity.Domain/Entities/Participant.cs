namespace ProxyMity.Domain.Entities;

public class Participant
{
    public required Ulid UserId { get; set; }

    public required Ulid ConversationId { get; set; }

    public required DateTime CreatedAt { get; set; }

    public DateTime? RemovedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public static Participant Create(Ulid userId, Ulid conversationId)
    {
        return new Participant()
        {
            ConversationId = conversationId,
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
        };
    }
}
