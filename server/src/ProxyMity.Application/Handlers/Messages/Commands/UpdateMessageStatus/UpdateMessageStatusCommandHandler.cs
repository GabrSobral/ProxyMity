namespace ProxyMity.Application.Handlers.Messages.Commands.UpdateMessageStatus;

public sealed class UpdateMessageStatusCommandHandler(
    ILogger<UpdateMessageStatusCommandHandler> logger,

    IMessageRepository messageRepository,
    IMessageStatusRepository messageStatusRepository,

    IUnitOfWork unitOfWork
) : ICommandHandler<UpdateMessageStatusCommand>
{
    public async Task Handle(UpdateMessageStatusCommand command, CancellationToken cancellationToken)
    {
        unitOfWork.BeginTransaction();

        logger.LogInformation($"Updating status from message '{command.MessageId}', to '{command.Status}' status");

        if (command.IsConversationGroup)
            await UpdateGroupMessage(command.MessageId, command.Status, command.UserId, command.ConversationId);
        else
            await UpdatePrivateMessage(command.MessageId, command.Status);

        await unitOfWork.CommitAsync(cancellationToken);
    }

    private async Task UpdatePrivateMessage(Ulid messageId, EMessageStatuses messageStatus)
    {
        await messageRepository.UpdateStatusAsync(messageId, messageStatus);
    }

    private async Task UpdateGroupMessage(Ulid messageId, EMessageStatuses messageStatus, Ulid userId, Ulid conversationId)
    {
        switch (messageStatus)
        {
            case EMessageStatuses.SENT:
                {
                    await messageRepository.UpdateStatusAsync(messageId, EMessageStatuses.SENT);
                    break;
                }

            case EMessageStatuses.READ:
                {
                    await messageStatusRepository.ReceiveAsync(messageId, userId);
                    var allMessageStatusFromMessage = await messageStatusRepository.GetMessagesStatusByMessageIdAsync(messageId, conversationId);

                    var allParticipantsReadTheMessage = allMessageStatusFromMessage.All(item => item.ReadAt is not null);

                    if (allParticipantsReadTheMessage)
                        await messageRepository.UpdateStatusAsync(messageId, EMessageStatuses.READ);
                    break;
                }

            case EMessageStatuses.RECEIVED:
                {
                    await messageStatusRepository.ReceiveAsync(messageId, userId);
                    var allMessageStatusFromMessage = await messageStatusRepository.GetMessagesStatusByMessageIdAsync(messageId, conversationId);

                    var allParticipantsReceiveTheMessage = allMessageStatusFromMessage.All(item => item.ReceivedAt is not null);

                    if (allParticipantsReceiveTheMessage)
                        await messageRepository.UpdateStatusAsync(messageId, EMessageStatuses.RECEIVED);
                    break;
                }
        }
    }
}
