namespace ProxyMity.Application.Handlers.Conversations.Commands.UnpinConversation;

public record UnpinConversationCommand(
    Ulid ConversationId,
    Ulid UserId
) : ICommand;
