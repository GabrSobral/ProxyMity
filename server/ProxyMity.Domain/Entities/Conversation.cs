namespace ProxyMity.Domain.Entities;

[Table("Conversation")]
public class Conversation
{
    public Conversation()
    {
        this.Participants = new HashSet<Participant>();
    }

    [Key]
    public Guid Id { get; set; }

    public Guid? GroupId { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? DisabledAt { get; set; }

    #region Relations

    public virtual IEnumerable<Participant> Participants { get; set; }

    [ForeignKey(nameof(GroupId))]
    public virtual Group Group { get; set; }

    #endregion
}
