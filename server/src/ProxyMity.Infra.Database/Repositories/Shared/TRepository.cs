namespace ProxyMity.Infra.Database.Repositories.Shared;

public class TRepository<T> where T : class {
    protected readonly DbSession _session;

    public TRepository(DbSession session) {
        _session = session;
    }
}
