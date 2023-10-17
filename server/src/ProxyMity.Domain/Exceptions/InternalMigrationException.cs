namespace ProxyMity.Domain.Exceptions;

public class InternalMigrationException : Exception {
    public InternalMigrationException(string message) : base($"Migration Failed: {message}") { }

    public InternalMigrationException(string message, Exception inner) : base($"Migration Failed: {message}", inner) { }
}
