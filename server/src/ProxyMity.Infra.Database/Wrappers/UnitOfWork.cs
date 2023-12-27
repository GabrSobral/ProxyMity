namespace ProxyMity.Infra.Database.Wrappers;

public class UnitOfWork(DbSession session) : IUnitOfWork
{
    public void BeginTransaction()
    {
        session.Transaction = session.Connection.BeginTransaction();
    }

    public void Commit()
    {
        session.Transaction?.Commit();
        Dispose();
    }
    public void Rollback()
    {
        session.Transaction?.Rollback();
        Dispose();
    }

    public void Dispose()
    {
        session.Transaction?.Dispose();
    }
}
