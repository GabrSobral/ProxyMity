namespace ProxyMity.Domain.Entities;

/// <summary>
/// The user entity, this entity represents each user at application.
/// </summary>
[Table("user")]
public class User
{
    [Key]
    public required Ulid Id { get; set; }

    public required string Name { get; set; }

    public required string Email { get; set; }

    public required string Password { get; set; }

    public DateTime? LastOnline { get; set; }

    public required DateTime CreatedAt { get; set; }

    public string? PhotoUrl { get; set; }

    #region Foreign Keys

    public IEnumerable<Message> Messages { get; set; }
    public IEnumerable<Participant> Participations { get; set; }

    #endregion

    public static User Create(string name, string email, string password)
    {
        return new User
        {
            Id = Ulid.NewUlid(),
            Name = name,
            Email = email,
            Password = password,
            CreatedAt = DateTime.UtcNow,
        };
    }
}
