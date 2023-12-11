namespace ProxyMity.Application.Handlers.Conversations.Commands.ReadConversationMessages;

internal sealed class ReadConversationMessagesCommandHandler(
    ILogger<ReadConversationMessagesCommandHandler> logger,
    IUnitOfWork unitOfWork,
    IMessageRepository messageRepository,
    IConversationRepository conversationRepository,
    IMessageStatusRepository messageStatusRepository
) : ICommandHandler<ReadConversationMessagesCommand>
{
    public async Task Handle(ReadConversationMessagesCommand request, CancellationToken cancellationToken)
    {
        var conversation = await conversationRepository.GetByIdAsync(request.ConversationId)
            ?? throw new ConversationNotFoundException(request.ConversationId);

        logger.LogInformation($"The user {request.UserId} is reading the messages of conversation {request.ConversationId}");

        unitOfWork.BeginTransaction();

        if (request.IsConversationGroup)
            await GroupConversationHandler(request.UserId, conversation);
        else
            await PrivateConversationHandler(request.UserId, conversation);

        unitOfWork.Commit();
    }

    private async Task GroupConversationHandler(Guid userId, Conversation conversation)
    {
        await messageStatusRepository.ReadUnreadMessagesByUserIdAsync(userId, conversation.Id);

        var allUnreadMessageStatusFromConversation =
            await messageStatusRepository.GetUnreadMessagesStatusFromConversationByIdAsync(conversation.Id);

        var allParticipantsReadTheMessage = allUnreadMessageStatusFromConversation.Any();

        if (allParticipantsReadTheMessage)
            await messageRepository.ReadUnreadMessagesByConversationIdAsync(userId, conversation.Id);
    }

    private async Task PrivateConversationHandler(Guid userId, Conversation conversation)
    {
        await messageRepository.ReadUnreadMessagesByConversationIdAsync(userId, conversation.Id);
    }
}
