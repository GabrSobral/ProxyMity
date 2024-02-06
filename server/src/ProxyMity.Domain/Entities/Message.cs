namespace ProxyMity.Domain.Entities;

[Table("message")]
public class Message
{
    [Key]
    public Ulid Id { get; set; }

    [Required]
    public required string Content { get; set; }

    [Required]
    public required Ulid ConversationId { get; set; }

    [Required]
    public required DateTime WrittenAt { get; set; }

    public DateTime? SentAt { get; set; }

    public DateTime? ReceivedByAllAt { get; set; }

    public DateTime? ReadByAllAt { get; set; }

    public Ulid? RepliedMessageId { get; set; }

    [Required]
    public required Ulid AuthorId { get; set; }

    public void ReadByAll() => ReadByAllAt = DateTime.UtcNow;

    public void ReceiveByAll() => ReceivedByAllAt = DateTime.UtcNow;

    public void Send() => SentAt = DateTime.UtcNow;

    #region Foreign Keys

    [ForeignKey(nameof(RepliedMessageId))]
    public Message? RepliedMessage { get; set; }

    [ForeignKey(nameof(AuthorId))]
    public User Author { get; set; }

    [ForeignKey(nameof(ConversationId))]
    public Conversation Conversation { get; set; }

    public IEnumerable<MessageStatus> MessageStatuses { get; set; } = new HashSet<MessageStatus>();

    #endregion

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
}
