namespace ProxyMity.Application.Handlers.Conversations.Commands.CreateGroupConversation;

public class CreateGroupConversationCommandHandler(
    ILogger<CreateGroupConversationCommandHandler> logger,

    IGroupRepository groupRepository,
    IParticipantRepository participantRepository,
    IConversationRepository conversationRepository,
    IUserRepository userRepository,

    DataContext dbContext
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

        await Task.WhenAll([
            groupRepository.CreateAsync(group, cancellationToken),
            conversationRepository.CreateAsync(conversation, cancellationToken)
        ]);

        for (int i = 0; i < participantsCount; i++)
        {
            var participantId = command.Participants.ElementAt(i);

             _ = await userRepository.FindByIdAsync(participantId, cancellationToken) ?? throw new UserNotFoundException(participantId);
            var existentParticipation = await participantRepository.GetByIdAsync(participantId, conversation.Id, cancellationToken);

            if (existentParticipation is null)
            {
                var participant = Participant.Create(participantId, conversation.Id);
                await participantRepository.AddAsync(participant, cancellationToken);

                logger.LogInformation($"🟢 Creating the parcipation of {participantId} at {conversation.Id} conversation...");
            }
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("🟢 A group conversation was created successfully!");

        return new CreateGroupConversationResponse(conversation, command.Participants);
    }
}
