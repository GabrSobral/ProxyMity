namespace ProxyMity.Domain.Entities;

[Table("Group")]
public class Group
{
    [Key]
    public required Guid Id { get; set; }

    [MaxLength(60)]
    public required string Name { get; set; }

    [MaxLength(300)]
    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    #region Relations

    public virtual Conversation Conversation { get; set; }

    #endregion
}
