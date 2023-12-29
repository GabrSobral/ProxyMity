namespace ProxyMity.Domain.Entities;

public class Conversation
{
    public Ulid Id { get; set; }

    public Ulid? GroupId { get; set; }

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
}
