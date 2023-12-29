namespace ProxyMity.Application.Handlers.Conversations.Commands.CreateGroupConversation;

public class CreateGroupConversationCommandHandler(
    ILogger<CreateGroupConversationCommandHandler> logger,

    IGroupRepository groupRepository,
    IParticipantRepository participantRepository,
    IConversationRepository conversationRepository,
    IUserRepository userRepository,

    IUnitOfWork unitOfWork
) : ICommandHandler<CreateGroupConversationCommand, CreateGroupConversationResponse>
{
    public async Task<CreateGroupConversationResponse> Handle(
        CreateGroupConversationCommand command, 
        CancellationToken cancellationToken)
    {
        logger.LogInformation($"🟢 Creating a group conversation...");

        var participantsCount = command.Participants.Count();

        var group = Group.Create(command.CreatorId, command.Name, command.Description);
        var conversation = Conversation.Create(group.Id);

        unitOfWork.BeginTransaction();

        await groupRepository.CreateAsync(group);
        await conversationRepository.CreateAsync(conversation);

        for (int i = 0; i < participantsCount; i++)
        {
            var participantId = command.Participants.ElementAt(i);

            _ = await userRepository.FindByIdAsync(participantId) ?? throw new UserNotFoundException(participantId);
            var existentParticipation = await participantRepository.GetByIdAsync(participantId, conversation.Id);

            if (existentParticipation is null)
            {
                var participant = Participant.Create(participantId, conversation.Id);
                await participantRepository.AddAsync(participant);

                logger.LogInformation($"🟢 Creating the parcipation of {participantId} at {conversation.Id} conversation...");
            }
        }

        await unitOfWork.CommitAsync(cancellationToken);

        logger.LogInformation("🟢 A group conversation was created successfully!");

        return new CreateGroupConversationResponse(conversation, command.Participants);
    }
}
