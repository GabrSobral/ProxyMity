namespace ProxyMity.Domain.Entities;

public class Group
{
    public required Ulid Id { get; set; }

    public required string Name { get; set; }

    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public Ulid CreatedBy { get; set; }

    public static Group Create(Ulid CreatedBy, string name, string? description = null)
    {
        return new Group()
        {
            Id = Ulid.NewUlid(),
            Name = name,
            Description = description,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = CreatedBy,
        };
    }
}
