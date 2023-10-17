namespace ProxyMity.Domain.Entities;

public class Participant {
    public required Guid UserId { get; set; }

    public required Guid ConversationId { get; set; }

    public required DateTime CreatedAt { get; set; }

    public DateTime? RemovedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public static Participant Create(Guid userId, Guid conversationId) {
        return new Participant() {
            ConversationId = conversationId,
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
        };
    }
}
