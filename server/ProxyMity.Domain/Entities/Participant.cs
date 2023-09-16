namespace ProxyMity.Domain.Entities;

[Table("Participant")]
public class Participant
{
    [Required]
    public required Guid UserId { get; set; }

    [Required]
    public required Guid ConversationId { get; set; }

    [Required]
    public required DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    #region Relations

    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; }

    [ForeignKey(nameof(ConversationId))]
    public virtual Conversation Conversation { get; set; }

    #endregion
}
