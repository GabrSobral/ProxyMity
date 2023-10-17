namespace ProxyMity.Domain.Entities;

/// <summary>
/// The user entity, this entity represents each user at application.
/// </summary>
public class User {
    public required Guid Id { get; set; }

    public required string Name { get; set; }

    public required string Email { get; set; }

    public required string Password { get; set; }

    public DateTime? LastOnline { get; set; }

    public required DateTime CreatedAt { get; set; }

    public string? PhotoUrl { get; set; }

    public static User Create(string name, string email, string password, string? photoUrl = null) {
        return new User() {
            Id = Guid.NewGuid(),
            Name = name,
            Email = email,
            Password = password,
            CreatedAt = DateTime.UtcNow,
            PhotoUrl = photoUrl
        };
    }
}
