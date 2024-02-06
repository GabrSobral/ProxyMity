namespace ProxyMity.Application.Handlers.Messages.Commands.UpdateMessageStatus;

public record UpdateMessageStatusCommand(
    Ulid MessageId,
    bool IsConversationGroup,
    Ulid ConversationId,
    EMessageStatuses Status,
    Ulid UserId
) : ICommand<bool>;
