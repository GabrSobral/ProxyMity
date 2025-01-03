﻿namespace ProxyMity.Domain.Entities;

[Table("user_profile")]
public sealed class UserProfile
{
    [Key]
    [ForeignKey("User")]
    public Guid UserId { get; set; }

    [MaxLength(255)]
    public required string FirstName { get; set; }

    [MaxLength(255)]
    public string LastName { get; set; } = string.Empty;

    [MaxLength(15)]
    public string? PhoneNumber { get; set; } = string.Empty;

    public string? Address { get; set; } = string.Empty;

    public string? PhotoUrl { get; set; } = string.Empty;

    public User User { get; set; }
}
