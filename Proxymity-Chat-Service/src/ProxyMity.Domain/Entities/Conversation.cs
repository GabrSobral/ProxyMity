namespace ProxyMity.Domain.Entities;

[Table("conversation")]
public class Conversation
{
    [Key]
    public Ulid Id { get; set; }

    public Ulid? GroupId { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? DisabledAt { get; set; }

    public static Conversation Create(Ulid? groupId = null)
    {
        return new Conversation
        {
            Id = Ulid.NewUlid(),
            GroupId = groupId,
            CreatedAt = DateTime.UtcNow,
        };
    }

    [ForeignKey(nameof(GroupId))]
    public Group? Group { get; set; }

    public IEnumerable<Participant> Participants { get; set; }
    public IEnumerable<Notification> Notifications { get; set; }
    public IEnumerable<Call> Call { get; set; }
}
