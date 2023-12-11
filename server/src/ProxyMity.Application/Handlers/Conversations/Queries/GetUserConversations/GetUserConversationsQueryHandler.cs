namespace ProxyMity.Application.Handlers.Conversations.Queries.GetUserConversations;

public sealed class GetUserConversationsQueryHandler(
    ILogger<GetUserConversationsQueryHandler> logger,
    IMessageRepository messageRepository,
    IParticipantRepository participantRepository,
    IMessageStatusRepository messageStatusRepository)
        : IQueryHandler<GetUserConversationsQuery, IEnumerable<GetUserConversationsResponse>>
{
    public async Task<IEnumerable<GetUserConversationsResponse>> Handle(GetUserConversationsQuery request, CancellationToken cancellationToken)
    {
        var userId = request.UserId;

        logger.LogInformation($"Listing conversations of {userId}...");

        var conversationsThatUserParticipate = await participantRepository.GetConversationsByUserIdAsync(userId);

        HashSet<GetUserConversationsResponse> conversations = [];

        foreach (var conversation in conversationsThatUserParticipate)
        {
            var participants = await participantRepository.GetParticipantsByConversationIdAsync(conversation.Id);
            var lastMessages = await messageRepository.GetMessagesFromConversationAsync(conversation.Id, 3);

            var unreadMessagesCount = conversation.GroupId is not null
                ? await messageStatusRepository.GetUnreadMessagesStatusCountByUserIdAsync(userId, conversation.Id)
                : await messageRepository.GetUnreadConversationMessagesCountAsync(userId, conversation.Id);

            var viewModel = new GetUserConversationsResponse(conversation, unreadMessagesCount, participants, lastMessages);
            conversations.Add(viewModel);
        }

        return conversations;
    }
}
