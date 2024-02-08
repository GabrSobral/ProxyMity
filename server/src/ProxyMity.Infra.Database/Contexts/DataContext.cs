namespace ProxyMity.Infra.Database.Contexts;

public class DataContext : DbContext
{
    public DataContext() { }

    public DataContext(DbContextOptions<DataContext> options) : base(options) { }

    public virtual DbSet<User> Users { get; set; }
    public virtual DbSet<Group> Groups { get; set; }
    public virtual DbSet<Message> Messages { get; set; }
    public virtual DbSet<Friendship> Friendships { get; set; }
    public virtual DbSet<Participant> Participants { get; set; }
    public virtual DbSet<Conversation> Conversations { get; set; }
    public virtual DbSet<MessageStatus> MessageStatuses { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Participant>()
            .HasKey(x => new { x.UserId, x.ConversationId}); // Creating the composite primary key of Participant Table

        modelBuilder.Entity<MessageStatus>()
           .HasKey(x => new { x.UserId, x.ConversationId, x.MessageId });
        
        modelBuilder.Entity<Friendship>()
            .HasKey(x => new { x.TargetId, x.RequesterId });
    }

    /// <summary>
    /// Method to parse the ULID for database and EF Core
    /// </summary>
    /// <param name="configurationBuilder"></param>
    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        configurationBuilder
            .Properties<Ulid>()
            .HaveConversion<UlidToStringConverter>();
    }
}
