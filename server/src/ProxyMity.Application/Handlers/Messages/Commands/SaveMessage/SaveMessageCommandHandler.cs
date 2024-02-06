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
            await CreateMessageStatusesToParticipantsOnGroup(message, cancellationToken);

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private async Task CreateMessageStatusesToParticipantsOnGroup(Message message, CancellationToken cancellationToken)
    {
        var participants = await participantRepository.GetByConversationIdAsync(message.ConversationId, cancellationToken);

        for (short i = 0; i < participants.Count; i++)
        {
            if (participants[i].UserId != message.AuthorId)
            {
                await messageStatusRepository.CreateAsync(
                    MessageStatus.Create(participants[i].UserId, message.Id, message.ConversationId),
                    cancellationToken
                );
            }
        }
    }
}
