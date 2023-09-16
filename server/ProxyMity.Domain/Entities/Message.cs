namespace ProxyMity.Domain.Entities;

[Table("Message")]
public class Message
{
    [Key]
    public Guid Id { get; set; }

    [MaxLength(10000)]
    public required string Content { get; set; }

    public Guid? ConversationId { get; set; }

    public DateTime WrittenAt { get; set; }

    public DateTime? SentAt { get; set; }

    public DateTime? ReceivedByAllAt { get; set; }

    public DateTime? ReadByAllAt { get; set; }

    public Guid? RepliedMessageId { get; set; }

    public required Guid AuthorId { get; set; }

    #region Relations

    [ForeignKey(nameof(RepliedMessageId))]
    public Message? RepliedMessage { get; set; }

    [ForeignKey(nameof(AuthorId))]
    public User Author { get; set; }

    #endregion
}
