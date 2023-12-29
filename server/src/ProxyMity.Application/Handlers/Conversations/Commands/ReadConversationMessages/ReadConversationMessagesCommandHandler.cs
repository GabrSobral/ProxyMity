namespace ProxyMity.Application.Handlers.Conversations.Commands.ReadConversationMessages;

internal sealed class ReadConversationMessagesCommandHandler(
    ILogger<ReadConversationMessagesCommandHandler> logger,
    IUnitOfWork unitOfWork,
    IMessageRepository messageRepository,
    IConversationRepository conversationRepository,
    IMessageStatusRepository messageStatusRepository
) : ICommandHandler<ReadConversationMessagesCommand>
{
    public async Task Handle(ReadConversationMessagesCommand command, CancellationToken cancellationToken)
    {
        var conversation = await conversationRepository.GetByIdAsync(command.ConversationId)
            ?? throw new ConversationNotFoundException(command.ConversationId);

        logger.LogInformation($"The user {command.UserId} is reading the messages of conversation {command.ConversationId}");

        unitOfWork.BeginTransaction();

        if (command.IsConversationGroup)
            await GroupConversationHandler(command.UserId, conversation);
        else
            await PrivateConversationHandler(command.UserId, conversation);

        await unitOfWork.CommitAsync(cancellationToken);
    }

    private async Task GroupConversationHandler(Ulid userId, Conversation conversation)
    {
        await messageStatusRepository.ReadUnreadMessagesByUserIdAsync(userId, conversation.Id);

        var allUnreadMessageStatusFromConversation =
            await messageStatusRepository.GetUnreadMessagesStatusFromConversationByIdAsync(conversation.Id);

        var allParticipantsReadTheMessage = allUnreadMessageStatusFromConversation.Any();

        if (allParticipantsReadTheMessage)
            await messageRepository.ReadUnreadMessagesByConversationIdAsync(userId, conversation.Id);
    }

    private async Task PrivateConversationHandler(Ulid userId, Conversation conversation)
    {
        await messageRepository.ReadUnreadMessagesByConversationIdAsync(userId, conversation.Id);
    }
}
