namespace ProxyMity.Application.Handlers.Conversations.Commands.PinConversation;

public record PinConversationCommand(
    Ulid ConversationId,
    Ulid UserId
) : ICommand;
