namespace ProxyMity.Application.Handlers.Conversations.Commands.PinConversation;

public sealed class PinConversationCommandHandler(
    ILogger<PinConversationCommandHandler> logger,
    
    IParticipantRepository participantRepository,

    DataContext dbContext
) : ICommandHandler<UnpinConversationCommand>
{
    public async Task Handle(UnpinConversationCommand command, CancellationToken cancellationToken)
    {
        var ( conversationId, userId ) = command;

        await participantRepository.PinConversation(conversationId, userId, cancellationToken);

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
