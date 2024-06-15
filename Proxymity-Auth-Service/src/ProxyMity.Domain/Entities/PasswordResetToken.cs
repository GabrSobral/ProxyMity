namespace ProxyMity.Domain.Entities;

[Table("password_reset_token")]
public class PasswordResetToken
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Ulid UserId { get; set; }

    [Required]
    [MaxLength(255)]
    public required string Token { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }

    [ForeignKey("UserId")]
    public User User { get; set; }
}
