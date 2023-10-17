namespace ProxyMity.Application.Handlers.Conversations.Commands.CreateGroupConversation;

public class CreateGroupConversationCommandHandler
    : ICommandHandler<CreateGroupConversationCommand, CreateGroupConversationResponse> {
    private readonly ILogger<CreateGroupConversationCommandHandler> _logger;

    private readonly IGroupRepository _groupRepository;
    private readonly IParticipantRepository _participantRepository;
    private readonly IConversationRepository _conversationRepository;
    private readonly IUserRepository _userRepository;

    private readonly IUnitOfWork _unitOfWork;

    public CreateGroupConversationCommandHandler(
        ILogger<CreateGroupConversationCommandHandler> logger,

        IGroupRepository groupRepository,
        IParticipantRepository participantRepository,
        IConversationRepository conversationRepository,
        IUserRepository userRepository,

        IUnitOfWork unitOfWork
    ) {
        _logger = logger;

        _groupRepository = groupRepository;
        _participantRepository = participantRepository;
        _conversationRepository = conversationRepository;
        _userRepository = userRepository;

        _unitOfWork = unitOfWork;
    }

    public async Task<CreateGroupConversationResponse> Handle(CreateGroupConversationCommand request, CancellationToken cancellationToken) {
        _logger.LogInformation($"🟢 Creating a group conversation...");

        var participantsCount = request.Participants.Count();

        var group = Group.Create(request.CreatorId, request.Name, request.Description);
        var conversation = Conversation.Create(group.Id);

        _unitOfWork.BeginTransaction();

        await _groupRepository.CreateAsync(group);
        await _conversationRepository.CreateAsync(conversation);

        for (int i = 0; i < participantsCount; i++) {
            var participantId = request.Participants.ElementAt(i);

            _ = await _userRepository.FindByIdAsync(participantId) ?? throw new UserNotFoundException(participantId);
            var existentParticipation = await _participantRepository.GetByIdAsync(participantId, conversation.Id);

            if (existentParticipation is null) {
                var participant = Participant.Create(participantId, conversation.Id);
                await _participantRepository.AddAsync(participant);

                _logger.LogInformation($"🟢 Creating the parcipation of {participantId} at {conversation.Id} conversation...");
            }
        }

        _unitOfWork.Commit();

        _logger.LogInformation("🟢 A group conversation was created successfully!");

        return new CreateGroupConversationResponse(conversation, request.Participants);
    }
}
