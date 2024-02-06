namespace ProxyMity.Application.Handlers.Conversations.Commands.ReadConversationMessages;

public record ReadConversationMessagesCommand(
    Ulid UserId,
    Ulid ConversationId,
    bool IsConversationGroup
) : ICommand<bool>;
