namespace ProxyMity.Domain.Entities;

[Table("MessageStatus")]
public class MessageStatus
{
    public required Guid UserId { get; set; }
    public required Guid MessageId { get; set; }
    public DateTime? ReadAt { get; set; }
    public DateTime? ReceivedAt { get; set; }

    #region Relations

    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; }

    [ForeignKey(nameof(MessageId))]
    public virtual Message Message { get; set; }

    #endregion
}
