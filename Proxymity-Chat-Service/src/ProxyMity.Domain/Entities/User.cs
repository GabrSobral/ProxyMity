namespace ProxyMity.Domain.Entities;

/// <summary>
/// The user entity, this entity represents each user at application.
/// </summary>
[Table("user")]
public class User
{
    [Key]
    public required Ulid Id { get; set; }

    public required string FirstName { get; set; }
    public required string LastName { get; set; }

    public required string Email { get; set; }

    public DateTime? LastOnline { get; set; }

    public required DateTime CreatedAt { get; set; }

    public string? PhotoUrl { get; set; }

    #region Foreign Keys

    public IEnumerable<Message> Messages { get; set; }
    public IEnumerable<Participant> Participations { get; set; }
    public IEnumerable<Notification> Notifications { get; set; }

    #endregion

    public static User Create(string firstName, string lastName, string email)
    {
        return new User
        {
            Id = Ulid.NewUlid(),
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            CreatedAt = DateTime.UtcNow,
        };
    }
}
