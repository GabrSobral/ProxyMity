namespace ProxyMity.Application.Handlers.Conversations.Queries.GetUserConversations;

public sealed class GetUserConversationsQueryHandler
    : IQueryHandler<GetUserConversationsQuery, IEnumerable<GetUserConversationsResponse>> {
    private readonly ILogger<GetUserConversationsQueryHandler> _logger;
    private readonly IMessageRepository _messageRepository;
    private readonly IParticipantRepository _participantRepository;
    private readonly IMessageStatusRepository _messageStatusRepository;

    public GetUserConversationsQueryHandler(
        ILogger<GetUserConversationsQueryHandler> logger,
        IMessageRepository messageRepository,
        IParticipantRepository participantRepository,
        IMessageStatusRepository messageStatusRepository
    ) {
        _logger = logger;
        _messageRepository = messageRepository;
        _participantRepository = participantRepository;
        _messageStatusRepository = messageStatusRepository;
    }

    public async Task<IEnumerable<GetUserConversationsResponse>> Handle(GetUserConversationsQuery request, CancellationToken cancellationToken) {
        var userId = request.UserId;

        _logger.LogInformation($"Listing conversations of {userId}...");

        var conversationsThatUserParticipate = await _participantRepository.GetConversationsByUserIdAsync(userId);

        HashSet<GetUserConversationsResponse> conversations = new();

        foreach (var conversation in conversationsThatUserParticipate) {
            var participants = await _participantRepository.GetParticipantsByConversationIdAsync(conversation.Id);
            var lastMessages = await _messageRepository.GetMessagesFromConversationAsync(conversation.Id, 3);

            var unreadMessagesCount = conversation.GroupId is not null
                ? await _messageStatusRepository.GetUnreadMessagesStatusCountByUserIdAsync(userId, conversation.Id)
                : await _messageRepository.GetUnreadConversationMessagesCountAsync(userId, conversation.Id);

            var viewModel = new GetUserConversationsResponse(conversation, unreadMessagesCount, participants, lastMessages);
            conversations.Add(viewModel);
        }

        return conversations;
    }
}
