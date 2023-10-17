namespace ProxyMity.Domain.Entities;

public class MessageStatus {
    public required Guid UserId { get; set; }
    public required Guid MessageId { get; set; }
    public required Guid ConversationId { get; set; }
    public DateTime? ReadAt { get; set; }
    public DateTime? ReceivedAt { get; set; }

    public static MessageStatus Create(Guid userId, Guid messageId, Guid conversationId) {
        return new MessageStatus() {
            UserId = userId,
            MessageId = messageId,
            ConversationId = conversationId
        };
    }

    public void Read() => ReadAt = DateTime.UtcNow;

    public void Receive() => ReceivedAt = DateTime.UtcNow;
}
