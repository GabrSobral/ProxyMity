namespace ProxyMity.Application.Handlers.Conversations.Commands.ReadConversationMessages;

internal sealed class ReadConversationMessagesCommandHandler(
    ILogger<ReadConversationMessagesCommandHandler> logger,

    IMessageRepository messageRepository,
    IConversationRepository conversationRepository,
    IMessageStatusRepository messageStatusRepository,
    
    DataContext dbContext
) : ICommandHandler<ReadConversationMessagesCommand, bool>
{
    public async Task<bool> Handle(ReadConversationMessagesCommand command, CancellationToken cancellationToken)
    {
        bool readByAll = false;
        var conversation = await conversationRepository.GetByIdAsync(command.ConversationId, cancellationToken)
            ?? throw new ConversationNotFoundException(command.ConversationId);

        logger.LogInformation($"The user {command.UserId} is reading the messages of conversation {command.ConversationId}");

        if (command.IsConversationGroup)
            readByAll = await GroupConversationHandler(command.UserId, conversation, cancellationToken);
        else
            readByAll = await PrivateConversationHandler(command.UserId, conversation, cancellationToken);

        await dbContext.SaveChangesAsync(cancellationToken);

        return readByAll;
    }

    private async Task<bool> GroupConversationHandler(Ulid userId, Conversation conversation, CancellationToken cancellationToken)
    {
        bool readByAll = false;
        
        await messageStatusRepository.ReadUnreadMessagesByUserIdAsync(userId, conversation.Id, cancellationToken);

        var allUnreadMessageStatusFromConversation =
            await messageStatusRepository.GetUnreadMessagesStatusFromConversationByIdAsync(conversation.Id, cancellationToken);

        var allParticipantsReadTheMessage = !allUnreadMessageStatusFromConversation.Any();

        if (allParticipantsReadTheMessage)
        {
            await messageRepository.ReadUnreadMessagesByConversationIdAsync(userId, conversation.Id, cancellationToken);
            readByAll = true;
        }

        return readByAll;
    }

    private async Task<bool> PrivateConversationHandler(Ulid userId, Conversation conversation, CancellationToken cancellationToken)
    {
        await messageRepository.ReadUnreadMessagesByConversationIdAsync(userId, conversation.Id, cancellationToken);

        return true;
    }
}
