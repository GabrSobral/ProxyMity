namespace ProxyMity.Application.Handlers.Messages.Commands.SaveMessage;

public sealed class SaveMessageCommandHandler(
    ILogger<SaveMessageCommandHandler> logger,

    IMessageRepository messageRepository,
    IMessageStatusRepository messageStatusRepository,
    IParticipantRepository participantRepository,
    IConversationRepository conversationRepository,

    IUnitOfWork unitOfWork
) : ICommandHandler<SaveMessageCommand>
{
    public async Task Handle(SaveMessageCommand command, CancellationToken cancellationToken)
    {
        var message = command.Message;

        logger.LogInformation($"Creating the {message.Id} message, from {message.AuthorId}");

        var conversation = await conversationRepository.GetByIdAsync(message.ConversationId)
            ?? throw new ConversationNotFoundException();

        unitOfWork.BeginTransaction();

        await messageRepository.CreateAsync(message);

        if (conversation.GroupId is Guid)
        {
            var participants = await participantRepository.GetByConversationIdAsync(message.ConversationId);

            Task[] tasks = new Task[participants.Count() - 1]; // Participants - Author
            short taskIndex = 0;

            for (short i = 0; i < participants.Count(); i++)
            {
                var currentParticipant = participants.ElementAt(i);

                if (currentParticipant.UserId != message.AuthorId)
                {
                    tasks[taskIndex] = messageStatusRepository.CreateAsync(
                        MessageStatus.Create(currentParticipant.UserId, message.Id, message.ConversationId));

                    taskIndex++;
                }
            }

            await Task.WhenAll(tasks);
        }

        unitOfWork.Commit();
    }
}
