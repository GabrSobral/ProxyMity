namespace ProxyMity.Application.Handlers.Conversations.Commands.CreatePrivateConversation;

public class CreatePrivateConversationCommandHandler(
    ILogger<CreatePrivateConversationCommandHandler> logger,

    IConversationRepository conversationRepository,
    IParticipantRepository participantRepository,
    IUserRepository userRepository,

    DataContext dbContext
) : ICommandHandler<CreatePrivateConversationCommand, CreatePrivateConversationResponse>
{
    public async Task<CreatePrivateConversationResponse> Handle(
        CreatePrivateConversationCommand command, 
        CancellationToken cancellationToken)
    {
        logger.LogInformation($"Creating a private conversation...");

        Ulid requesterId = command.RequesterId;
        Ulid participantId = command.ParticipantId;

        _ = await userRepository.FindByIdAsync(participantId, cancellationToken) ?? throw new UserNotFoundException(participantId);
        _ = await userRepository.FindByIdAsync(requesterId, cancellationToken) ?? throw new UserNotFoundException(requesterId);

        var conversation = Conversation.Create();
        var requesterParticipation = Participant.Create(requesterId, conversation.Id);
        var targetParticipation = Participant.Create(participantId, conversation.Id);

        await conversationRepository.CreateAsync(conversation, cancellationToken);
        await participantRepository.AddAsync(requesterParticipation, cancellationToken);
        await participantRepository.AddAsync(targetParticipation, cancellationToken);

        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation($"A private conversation between {requesterId} and {participantId} was created successfully!");

        Ulid[] participantsId = [requesterId, participantId];

        return new CreatePrivateConversationResponse(conversation, participantsId);
    }
}
