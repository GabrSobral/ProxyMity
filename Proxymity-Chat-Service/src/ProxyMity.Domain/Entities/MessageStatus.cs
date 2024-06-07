namespace ProxyMity.Domain.Entities;

[Table("message_status")]
public class MessageStatus
{
    public required Ulid UserId { get; set; }
    public required Ulid MessageId { get; set; }
    public required Ulid ConversationId { get; set; }
    public DateTime? ReadAt { get; set; }
    public DateTime? ReceivedAt { get; set; }

    #region Foreign Keys

    [ForeignKey(nameof(UserId))]
    public User User { get; set; }

    [ForeignKey(nameof(MessageId))]
    public Message Message { get; set; }

    [ForeignKey(nameof(ConversationId))]
    public Conversation Conversation { get; set; }

    #endregion

    public void Read() => ReadAt = DateTime.UtcNow;
    public void Receive() => ReceivedAt = DateTime.UtcNow;

    public static MessageStatus Create(Ulid userId, Ulid messageId, Ulid conversation)
    {
        return new MessageStatus()
        {
            UserId = userId,
            MessageId = messageId,
            ConversationId = conversation
        };
    }
}
