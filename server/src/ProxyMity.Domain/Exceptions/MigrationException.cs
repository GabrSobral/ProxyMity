namespace ProxyMity.Domain.Exceptions;

public class MigrationException : Exception {
    public MigrationException(string tableName) : base($"Failed: {tableName} not prepared") { }

    public MigrationException(string tableName, Exception inner) : base($"Failed: {tableName} not prepared", inner) { }
}
