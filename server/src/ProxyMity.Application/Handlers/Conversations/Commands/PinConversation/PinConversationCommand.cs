namespace ProxyMity.Application.Handlers.Conversations.Commands.PinConversation;

public record UnpinConversationCommand(
    Ulid ConversationId,
    Ulid UserId
) : ICommand;
