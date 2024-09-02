namespace ProxyMity.Domain.Entities;

[Table("call")]
public class Call
{
    [Key]
    public Ulid Id { get; set; }

    public Ulid ConversationId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? FinishedAt { get; set; }

    public ECallStates State { get; set; }

    public Ulid CreatedBy { get; set; }


    [ForeignKey(nameof(ConversationId))]
    public Conversation Conversation { get; set; }

    [ForeignKey(nameof(CreatedBy))]
    public User CreatedByUser { get; set; }

    public static Call Create(Ulid conversationId, Ulid userId)
    {
        return new Call
        {
            CreatedBy = userId,
            ConversationId = conversationId,
            CreatedAt = DateTime.UtcNow,
            State = ECallStates.CALLING
        };
    }
}
