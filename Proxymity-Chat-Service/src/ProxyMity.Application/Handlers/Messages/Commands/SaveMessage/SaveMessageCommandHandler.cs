namespace ProxyMity.Application.Handlers.Messages.Commands.SaveMessage;

public sealed class SaveMessageCommandHandler(
    ILogger<SaveMessageCommandHandler> logger,

    IMessageRepository messageRepository,
    IMessageStatusRepository messageStatusRepository,
    IParticipantRepository participantRepository,
    IConversationRepository conversationRepository,

    DataContext dbContext
) : ICommandHandler<SaveMessageCommand>
{
    public async Task Handle(SaveMessageCommand command, CancellationToken cancellationToken)
    {
        var message = command.Message;

        logger.LogInformation($"Creating the {message.Id} message, from {message.AuthorId}");

        var conversation = await conversationRepository.GetByIdAsync(message.ConversationId, cancellationToken)
            ?? throw new ConversationNotFoundException();

        await messageRepository.CreateAsync(message, cancellationToken);

        if (conversation.GroupId is not null)
        {
            var participants = await participantRepository.GetByConversationIdAsync(message.ConversationId, cancellationToken);

            for (short i = 0; i < participants.Count; i++)
            {
                if (participants[i].UserId == message.AuthorId) continue;
                
                var messageStatus = MessageStatus.Create(participants[i].UserId, message.Id, message.ConversationId);
                await messageStatusRepository.CreateAsync(messageStatus,  cancellationToken);
            }
            
            logger.LogInformation($"Message statuses was created from message '{message.Id}'");
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
