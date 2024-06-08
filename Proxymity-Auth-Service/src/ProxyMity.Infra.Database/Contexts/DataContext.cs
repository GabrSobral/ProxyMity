namespace ProxyMity.Infra.Database.Contexts;

public class DataContext : DbContext
{
    public DataContext() { }

    public DataContext(DbContextOptions<DataContext> options) : base(options) { }

    public virtual DbSet<User> Users { get; set; }
    public virtual DbSet<RefreshToken> RefreshTokens { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

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
