namespace ProxyMity.Infra.Database.Wrappers;

public class UnitOfWork(DbSession session) : IUnitOfWork
{
    public void BeginTransaction()
    {
        session.Transaction = session.Connection.BeginTransaction();
    }

    public async Task CommitAsync(CancellationToken cancellationToken)
    {
        await session?.Transaction?.CommitAsync(cancellationToken);
    }
    public async Task RollbackAsync(CancellationToken cancellationToken)
    {
        await session?.Transaction?.RollbackAsync(cancellationToken);
    }
}
