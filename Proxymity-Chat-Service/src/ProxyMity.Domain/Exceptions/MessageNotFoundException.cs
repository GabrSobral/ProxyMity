namespace ProxyMity.Domain.Exceptions;

public sealed class MessageNotFoundException(Ulid messageId) 
    : Exception($"The message '{messageId}' was not found.")
{
}
