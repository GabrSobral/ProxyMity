namespace ProxyMity.Domain;

[Table("team")]
public class Team
{
    public Ulid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Ulid CompanyId { get; set; }
    public DateTime CreatedAt { get; set; }
    public Ulid CreatedBy { get; set; }

    [ForeignKey(nameof(CompanyId))]
    public Company Company { get; set; }
}
