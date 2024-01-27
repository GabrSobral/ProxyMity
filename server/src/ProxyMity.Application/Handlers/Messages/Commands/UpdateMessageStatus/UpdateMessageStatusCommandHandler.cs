namespace ProxyMity.Application.Handlers.Messages.Commands.UpdateMessageStatus;

public sealed class UpdateMessageStatusCommandHandler(
    ILogger<UpdateMessageStatusCommandHandler> logger,

    IMessageRepository messageRepository,
    IMessageStatusRepository messageStatusRepository,

    DataContext dbContext
) : ICommandHandler<UpdateMessageStatusCommand>
{
    public async Task Handle(UpdateMessageStatusCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation($"Updating status from message '{command.MessageId}', to '{command.Status}' status");

        if (command.IsConversationGroup)
            await UpdateGroupMessage(command.MessageId, command.Status, command.UserId, command.ConversationId, cancellationToken);
        else
            await UpdatePrivateMessage(command.MessageId, command.Status, cancellationToken);

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private async Task UpdatePrivateMessage(Ulid messageId, EMessageStatuses messageStatus, CancellationToken cancellationToken)
    {
        await messageRepository.UpdateStatusAsync(messageId, messageStatus, cancellationToken);
    }

    private async Task UpdateGroupMessage(Ulid messageId, EMessageStatuses messageStatus, Ulid userId, Ulid conversationId, CancellationToken cancellationToken)
    {
        switch (messageStatus)
        {
            case EMessageStatuses.SENT:
            {
                await messageRepository.UpdateStatusAsync(messageId, EMessageStatuses.SENT, cancellationToken);
                break;
            }

            case EMessageStatuses.READ:
            {
                await messageStatusRepository.ReadAsync(userId, messageId, conversationId, cancellationToken);
                var allMessageStatusFromMessage = await messageStatusRepository.GetMessagesStatusByMessageIdAsync(messageId, conversationId, cancellationToken);

                var allParticipantsReadTheMessage = allMessageStatusFromMessage.All(item => item.ReadAt is not null);

                if (allParticipantsReadTheMessage)
                    await messageRepository.UpdateStatusAsync(messageId, EMessageStatuses.READ, cancellationToken);
                break;
            }

            case EMessageStatuses.RECEIVED:
            {
                await messageStatusRepository.ReceiveAsync(userId, messageId, conversationId, cancellationToken);
                var allMessageStatusFromMessage = await messageStatusRepository.GetMessagesStatusByMessageIdAsync(messageId, conversationId, cancellationToken);

                var allParticipantsReceiveTheMessage = allMessageStatusFromMessage.All(item => item.ReceivedAt is not null);

                if (allParticipantsReceiveTheMessage)
                    await messageRepository.UpdateStatusAsync(messageId, EMessageStatuses.RECEIVED, cancellationToken);
                break;
            }
        }
    }
}
