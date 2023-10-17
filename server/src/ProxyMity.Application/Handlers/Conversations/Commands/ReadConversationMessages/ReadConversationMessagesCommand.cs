namespace ProxyMity.Application.Handlers.Conversations.Commands.ReadConversationMessages;

public record ReadConversationMessagesCommand(
    Guid UserId,
    Guid ConversationId,
    bool IsConversationGroup
) : ICommand;
