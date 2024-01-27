namespace ProxyMity.Application.Handlers.Conversations.Commands.ReadConversationMessages;

internal sealed class ReadConversationMessagesCommandHandler(
    ILogger<ReadConversationMessagesCommandHandler> logger,

    IMessageRepository messageRepository,
    IConversationRepository conversationRepository,
    IMessageStatusRepository messageStatusRepository,
    
    DataContext dbContext
) : ICommandHandler<ReadConversationMessagesCommand>
{
    public async Task Handle(ReadConversationMessagesCommand command, CancellationToken cancellationToken)
    {
        var conversation = await conversationRepository.GetByIdAsync(command.ConversationId, cancellationToken)
            ?? throw new ConversationNotFoundException(command.ConversationId);

        logger.LogInformation($"The user {command.UserId} is reading the messages of conversation {command.ConversationId}");

        if (command.IsConversationGroup)
            await GroupConversationHandler(command.UserId, conversation, cancellationToken);
        else
            await PrivateConversationHandler(command.UserId, conversation, cancellationToken);

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private async Task GroupConversationHandler(Ulid userId, Conversation conversation, CancellationToken cancellationToken)
    {
        await messageStatusRepository.ReadUnreadMessagesByUserIdAsync(userId, conversation.Id, cancellationToken);

        var allUnreadMessageStatusFromConversation =
            await messageStatusRepository.GetUnreadMessagesStatusFromConversationByIdAsync(conversation.Id, cancellationToken);

        var allParticipantsReadTheMessage = !allUnreadMessageStatusFromConversation.Any();

        if (allParticipantsReadTheMessage)
            await messageRepository.ReadUnreadMessagesByConversationIdAsync(userId, conversation.Id, cancellationToken);
    }

    private async Task PrivateConversationHandler(Ulid userId, Conversation conversation, CancellationToken cancellationToken)
    {
        await messageRepository.ReadUnreadMessagesByConversationIdAsync(userId, conversation.Id, cancellationToken);
    }
}
