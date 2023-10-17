namespace ProxyMity.Domain.Entities;

public class Message {
    public Guid Id { get; set; }

    public required string Content { get; set; }

    public Guid ConversationId { get; set; }

    public DateTime WrittenAt { get; set; }

    public DateTime? SentAt { get; set; }

    public DateTime? ReceivedByAllAt { get; set; }

    public DateTime? ReadByAllAt { get; set; }

    public Guid? RepliedMessageId { get; set; }

    public required Guid AuthorId { get; set; }

    public static Message Create(string content, Guid conversationId, Guid authorId, DateTime? writtenAt = null) {
        return new Message() {
            Id = Guid.NewGuid(),
            Content = content,
            ConversationId = conversationId,
            AuthorId = authorId,
            WrittenAt = writtenAt ?? DateTime.UtcNow,
        };
    }

    public void ReadByAll() => ReadByAllAt = DateTime.UtcNow;

    public void ReceiveByAll() => ReceivedByAllAt = DateTime.UtcNow;

    public void Send() => SentAt = DateTime.UtcNow;
}
