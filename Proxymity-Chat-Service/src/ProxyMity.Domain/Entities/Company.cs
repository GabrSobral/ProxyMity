namespace ProxyMity.Domain;

[Table("company")]
public class Company
{
    [Key]
    public Ulid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Domain { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Ulid CreatedBy { get; set; }
}
