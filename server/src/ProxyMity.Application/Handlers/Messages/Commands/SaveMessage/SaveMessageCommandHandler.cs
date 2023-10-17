namespace ProxyMity.Application.Handlers.Messages.Commands.SaveMessage;

public sealed class SaveMessageCommandHandler : ICommandHandler<SaveMessageCommand> {
    private readonly ILogger<SaveMessageCommandHandler> _logger;
    private readonly IMessageRepository _messageRepository;
    private readonly IMessageStatusRepository _messageStatusRepository;
    private readonly IParticipantRepository _participantRepository;
    private readonly IConversationRepository _conversationRepository;
    private readonly IUnitOfWork _unitOfWork;

    public SaveMessageCommandHandler(
        ILogger<SaveMessageCommandHandler> logger,
        IMessageRepository messageRepository,
        IMessageStatusRepository messageStatusRepository,
        IParticipantRepository participantRepository,
        IConversationRepository conversationRepository,
        IUnitOfWork unitOfWork
    ) {
        _logger = logger;
        _messageRepository = messageRepository;
        _messageStatusRepository = messageStatusRepository;
        _participantRepository = participantRepository;
        _conversationRepository = conversationRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task Handle(SaveMessageCommand request, CancellationToken cancellationToken) {
        var message = request.Message;

        _logger.LogInformation($"Creating the {message.Id} message, from {message.AuthorId}");

        var conversation = await _conversationRepository.GetByIdAsync(message.ConversationId)
            ?? throw new ArgumentNullException();

        _unitOfWork.BeginTransaction();

        await _messageRepository.CreateAsync(message);

        if (conversation.GroupId is Guid) {
            var participants = await _participantRepository.GetByConversationIdAsync(message.ConversationId);

            Task[] tasks = new Task[participants.Count() - 1]; // Participants - Author
            short taskIndex = 0;

            for (short i = 0; i < participants.Count(); i++) {
                var currentParticipant = participants.ElementAt(i);

                if (currentParticipant.UserId != message.AuthorId) {
                    tasks[taskIndex] = _messageStatusRepository.CreateAsync(
                        MessageStatus.Create(currentParticipant.UserId, message.Id, message.ConversationId));

                    taskIndex++;
                }
            }

            await Task.WhenAll(tasks);
        }

        _unitOfWork.Commit();
    }
}
