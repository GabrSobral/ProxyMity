namespace ProxyMity.Domain.Entities;

[Table("User")]
public class User
{
    public User()
    {
        Messages = new HashSet<Message>();
        Participations = new HashSet<Participant>();
    }

    [Key]
    [Required]
    public required Guid Id { get; set; }

    [Required]
    [MaxLength(90)]
    public required string Name { get; set; }

    [Required]
    [MaxLength(90)]
    public required string Email { get; set; }

    [Required]
    [MaxLength(150)]
    public required string Password { get; set; }

    public required DateTime? LastOnline { get; set; }

    [Required]
    public required DateTime CreatedAt { get; set; }

    public string? PhotoUrl { get; set; }

    #region Relations

    public virtual IEnumerable<Message> Messages { get; set; }
    public virtual IEnumerable<Participant> Participations { get; set; }

    #endregion
}
