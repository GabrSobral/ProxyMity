namespace ProxyMity.Domain.Entities;

public class Message
{
    public Ulid Id { get; set; }

    public required string Content { get; set; }

    public Ulid ConversationId { get; set; }

    public DateTime WrittenAt { get; set; }

    public DateTime? SentAt { get; set; }

    public DateTime? ReceivedByAllAt { get; set; }

    public DateTime? ReadByAllAt { get; set; }

    public Ulid? RepliedMessageId { get; set; }

    public required Ulid AuthorId { get; set; }

    public static Message Create(string content, Ulid conversationId, Ulid authorId, DateTime? writtenAt = null)
    {
        return new Message()
        {
            Id = Ulid.NewUlid(),
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
