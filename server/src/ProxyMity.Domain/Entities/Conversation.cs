namespace ProxyMity.Domain.Entities;

public class Conversation {
    public Guid Id { get; set; }

    public Guid? GroupId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? DisabledAt { get; set; }

    public static Conversation Create(Guid? groupId = null) {
        return new Conversation {
            Id = Guid.NewGuid(),
            GroupId = groupId,
            CreatedAt = DateTime.UtcNow,
        };
    }
}
