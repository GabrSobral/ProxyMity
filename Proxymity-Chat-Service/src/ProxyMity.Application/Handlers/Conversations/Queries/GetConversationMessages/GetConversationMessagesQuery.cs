namespace ProxyMity.Application.Handlers.Conversations.Queries.GetConversationMessages;

public record GetConversationMessagesQuery(
    Ulid ConversationId
): IQuery<IEnumerable<Message>>;
