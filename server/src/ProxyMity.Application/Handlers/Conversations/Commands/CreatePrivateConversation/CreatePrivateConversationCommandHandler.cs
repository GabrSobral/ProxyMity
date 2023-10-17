namespace ProxyMity.Application.Handlers.Conversations.Commands.CreatePrivateConversation;

public class CreatePrivateConversationCommandHandler
    : ICommandHandler<CreatePrivateConversationCommand, CreatePrivateConversationResponse> {
    private readonly ILogger<CreatePrivateConversationCommandHandler> _logger;

    private readonly IConversationRepository _conversationRepository;
    private readonly IParticipantRepository _participantRepository;
    private readonly IUserRepository _userRepository;

    private readonly IUnitOfWork _unitOfWork;

    public CreatePrivateConversationCommandHandler(
        ILogger<CreatePrivateConversationCommandHandler> logger,

        IConversationRepository conversationRepository,
        IParticipantRepository participantRepository,
        IUserRepository userRepository,

        IUnitOfWork unitOfWork
    ) {
        _logger = logger;

        _conversationRepository = conversationRepository;
        _participantRepository = participantRepository;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<CreatePrivateConversationResponse> Handle(CreatePrivateConversationCommand request, CancellationToken cancellationToken) {
        _logger.LogInformation($"Creating a private conversation...");

        Guid requesterId = request.RequesterId;
        Guid participantId = request.ParticipantId;

        _ = await _userRepository.FindByIdAsync(requesterId) ?? throw new UserNotFoundException(requesterId);
        _ = await _userRepository.FindByIdAsync(participantId) ?? throw new UserNotFoundException(participantId);

        var conversation = Conversation.Create();
        var requesterParticipation = Participant.Create(requesterId, conversation.Id);
        var targetParticipation = Participant.Create(participantId, conversation.Id);

        _unitOfWork.BeginTransaction();

        await _conversationRepository.CreateAsync(conversation);
        await _participantRepository.AddAsync(requesterParticipation);
        await _participantRepository.AddAsync(targetParticipation);

        _unitOfWork.Commit();

        _logger.LogInformation($"A private conversation between {requesterId} and {participantId} was created successfully!");

        Guid[] participantsId = new Guid[2] { requesterId, participantId };

        return new CreatePrivateConversationResponse(conversation, participantsId);
    }
}
