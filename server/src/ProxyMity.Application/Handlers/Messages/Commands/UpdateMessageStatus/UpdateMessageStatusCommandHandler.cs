namespace ProxyMity.Application.Handlers.Messages.Commands.UpdateMessageStatus;

public sealed class UpdateMessageStatusCommandHandler(
    ILogger<UpdateMessageStatusCommandHandler> logger,

    IMessageRepository messageRepository,
    IMessageStatusRepository messageStatusRepository,

    DataContext dbContext
) : ICommandHandler<UpdateMessageStatusCommand, bool>
{
    public async Task<bool> Handle(UpdateMessageStatusCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation($"Updating status from message '{command.MessageId}', to '{command.Status}' status");

        var statusAppliedForAll = false;

        if (command.Status is EMessageStatuses.SENT)
            await UpdateMessageStatusAsync();
        else
        {
            if (command.IsConversationGroup)
            {
                await messageStatusRepository
                    .UpdateStatusAsync(command.UserId, command.MessageId, command.ConversationId, command.Status, cancellationToken);

                var allMessageStatusFromMessage = await messageStatusRepository
                    .GetMessagesStatusByMessageIdAsync(command.MessageId, command.ConversationId, cancellationToken);

                Predicate<MessageStatus> predicate = command.Status switch
                {
                    EMessageStatuses.READ => status => status.ReadAt != null,
                    EMessageStatuses.RECEIVED => status => status.ReceivedAt != null,
                    EMessageStatuses.SENT => throw new NotImplementedException(),
                    _ => throw new NotImplementedException(),
                };

                var currentMessageStatusIndex = allMessageStatusFromMessage.FindIndex(x => x.UserId == command.UserId);

                if (currentMessageStatusIndex > -1)
                {
                    if (command.Status == EMessageStatuses.READ)
                        allMessageStatusFromMessage[currentMessageStatusIndex].Read();

                    if (command.Status == EMessageStatuses.RECEIVED)
                        allMessageStatusFromMessage[currentMessageStatusIndex].Receive();
                    
                    if (allMessageStatusFromMessage.TrueForAll(predicate))
                        await UpdateMessageStatusAsync();
                }
            }
            else
                await UpdateMessageStatusAsync();
        }
        
        await dbContext.SaveChangesAsync(cancellationToken);

        return statusAppliedForAll;
        
        async Task UpdateMessageStatusAsync()
        {
            await messageRepository.UpdateStatusAsync(command.MessageId, command.Status, cancellationToken);
            statusAppliedForAll = true;
        }
    }
}
