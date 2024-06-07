namespace ProxyMity.Domain.Entities;

[Table("group")]
public class Group
{
    [Key]
    public required Ulid Id { get; set; }

    [Required]
    public required string Name { get; set; }

    public string? Description { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    [Required]
    public Ulid CreatedBy { get; set; }

    public Conversation Conversation { get; set; }

    public static Group Create(Ulid creatorBy, string groupName, string? groupDescription)
    {
        return new Group
        {
            Id = Ulid.NewUlid(),
            Name = groupName,
            Description = groupDescription,
            CreatedBy = creatorBy,
            CreatedAt = DateTime.UtcNow
        };
    }
}
