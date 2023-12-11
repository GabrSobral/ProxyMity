namespace ProxyMity.Domain.Entities;

public class Group
{
    public required Guid Id { get; set; }

    public required string Name { get; set; }

    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public Guid CreatedBy { get; set; }

    public static Group Create(Guid CreatedBy, string name, string? description = null)
    {
        return new Group()
        {
            Id = Guid.NewGuid(),
            Name = name,
            Description = description,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = CreatedBy,
        };
    }
}
