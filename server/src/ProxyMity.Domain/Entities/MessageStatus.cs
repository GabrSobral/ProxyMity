namespace ProxyMity.Domain.Entities;

public class MessageStatus
{
    public required Ulid UserId { get; set; }
    public required Ulid MessageId { get; set; }
    public required Ulid ConversationId { get; set; }
    public DateTime? ReadAt { get; set; }
    public DateTime? ReceivedAt { get; set; }

    public static MessageStatus Create(Ulid userId, Ulid messageId, Ulid conversationId)
    {
        return new MessageStatus()
        {
            UserId = userId,
            MessageId = messageId,
            ConversationId = conversationId
        };
    }

    public void Read() => ReadAt = DateTime.UtcNow;

    public void Receive() => ReceivedAt = DateTime.UtcNow;
}
