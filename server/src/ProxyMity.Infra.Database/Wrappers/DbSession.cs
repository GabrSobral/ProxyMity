namespace ProxyMity.Infra.Database.Wrappers;

/// <summary>
/// 
/// </summary>
public sealed class DbSession : IDisposable
{
    public IDbConnection Connection { get; set; }
    public IDbTransaction? Transaction { get; set; }

    public DbSession(IConfiguration configuration)
    {
        Connection = new NpgsqlConnection(configuration.GetConnectionString("PostgreSQL"));
        Connection.Open();
    }

    public void Dispose() => Connection?.Dispose();
}
