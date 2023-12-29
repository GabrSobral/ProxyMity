namespace ProxyMity.Domain.Exceptions;

public class ConversationNotFoundException : Exception
{
    public ConversationNotFoundException() : base("The conversation was not found") { }
    public ConversationNotFoundException(Ulid conversationId) : base($"The conversation {conversationId} was not found") { }
}
