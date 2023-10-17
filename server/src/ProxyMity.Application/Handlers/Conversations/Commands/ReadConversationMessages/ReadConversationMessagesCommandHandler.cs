namespace ProxyMity.Application.Handlers.Conversations.Commands.ReadConversationMessages;

internal sealed class ReadConversationMessagesCommandHandler : ICommandHandler<ReadConversationMessagesCommand> {
    private readonly ILogger<ReadConversationMessagesCommandHandler> _logger;
    private readonly IUnitOfWork _unitOfWork;

    private readonly IMessageRepository _messageRepository;
    private readonly IConversationRepository _conversationRepository;
    private readonly IMessageStatusRepository _messageStatusRepository;

    public ReadConversationMessagesCommandHandler(
        ILogger<ReadConversationMessagesCommandHandler> logger,
        IUnitOfWork unitOfWork,
        IMessageRepository messageRepository,
        IConversationRepository conversationRepository,
        IMessageStatusRepository messageStatusRepository
    ) {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _messageRepository = messageRepository;
        _conversationRepository = conversationRepository;
        _messageStatusRepository = messageStatusRepository;
    }

    public async Task Handle(ReadConversationMessagesCommand request, CancellationToken cancellationToken) {
        var conversation = await _conversationRepository.GetByIdAsync(request.ConversationId)
            ?? throw new ConversationNotFoundException(request.ConversationId);

        _logger.LogInformation($"The user {request.UserId} is reading the messages of conversation {request.ConversationId}");

        _unitOfWork.BeginTransaction();

        if (request.IsConversationGroup)
            await GroupConversationHandler(request.UserId, conversation);
        else
            await PrivateConversationHandler(request.UserId, conversation);

        _unitOfWork.Commit();
    }

    private async Task GroupConversationHandler(Guid userId, Conversation conversation) {
        await _messageStatusRepository.ReadUnreadMessagesByUserIdAsync(userId, conversation.Id);

        var allUnreadMessageStatusFromConversation =
            await _messageStatusRepository.GetUnreadMessagesStatusFromConversationByIdAsync(conversation.Id);

        var allParticipantsReadTheMessage = allUnreadMessageStatusFromConversation.Any();

        if (allParticipantsReadTheMessage)
            await _messageRepository.ReadUnreadMessagesByConversationIdAsync(userId, conversation.Id);
    }

    private async Task PrivateConversationHandler(Guid userId, Conversation conversation) {
        await _messageRepository.ReadUnreadMessagesByConversationIdAsync(userId, conversation.Id);
    }
}
