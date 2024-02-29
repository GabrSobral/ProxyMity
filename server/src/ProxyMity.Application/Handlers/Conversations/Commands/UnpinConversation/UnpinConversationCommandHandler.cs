namespace ProxyMity.Application.Handlers.Conversations.Commands.UnpinConversation;

public sealed class UnpinConversationCommandHandler(
    ILogger<UnpinConversationCommandHandler> logger,
    
    IParticipantRepository participantRepository,

    DataContext dbContext
) : ICommandHandler<UnpinConversationCommand>
{
    public async Task Handle(UnpinConversationCommand command, CancellationToken cancellationToken)
    {
        var ( conversationId, userId ) = command;

        await participantRepository.UnpinConversation(conversationId, userId, cancellationToken);

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
