namespace ProxyMity.Domain.Interfaces.Repositories.Shared;

public interface IUnitOfWork
{
    void BeginTransaction();
    Task CommitAsync(CancellationToken cancellationToken);
    Task RollbackAsync(CancellationToken cancellationToken);
}
