namespace ProxyMity.Infraestructure.Data.Context;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options) { }

    public DataContext() { }

    public virtual DbSet<User> Users { get; set; }
    public virtual DbSet<Group> Groups { get; set; }
    public virtual DbSet<Conversation> Conversations { get; set; }
    public virtual DbSet<MessageStatus> MessageStatuses { get; set; }
    public virtual DbSet<Message> Messages { get; set; }
    public virtual DbSet<Participant> Participants { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Participant>().HasKey(table => new
        {
            table.UserId,
            table.ConversationId,
        });

        modelBuilder.Entity<MessageStatus>().HasKey(table => new
        {
            table.UserId,
            table.MessageId,
        });
    }
}
