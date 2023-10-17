namespace ProxyMity.Application.Handlers.Messages.Commands.UpdateMessageStatus;

public record UpdateMessageStatusCommand(
    Guid MessageId,
    bool IsConversationGroup,
    Guid ConversationId,
    EMessageStatuses Status,
    Guid UserId
) : ICommand;
