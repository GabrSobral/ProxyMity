namespace ProxyMity.Domain.Entities;

[Table("call_session")]
public class CallSession
{
    [Key]
    public Ulid Id { get; set; }

    public Ulid UserId { get; set; }

    public Ulid CallId { get; set; }

    public DateTime JoinedAt { get; set; }
    public DateTime LeftIn { get; set; }

    [ForeignKey(nameof(UserId))]
    public User User { get; set; }

    [ForeignKey(nameof(CallId))]
    public Call Call { get; set; }

    public static CallSession Create(Ulid userId, Ulid callId)
    {
        return new CallSession
        {
            UserId = userId,
            CallId = callId,
            JoinedAt = DateTime.UtcNow,
        };
    }
}
