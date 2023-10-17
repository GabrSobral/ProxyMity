namespace ProxyMity.Domain.Interfaces.Repositories.Shared;

public interface IUnitOfWork : IDisposable {
    void BeginTransaction();
    void Commit();
    void Rollback();
}
