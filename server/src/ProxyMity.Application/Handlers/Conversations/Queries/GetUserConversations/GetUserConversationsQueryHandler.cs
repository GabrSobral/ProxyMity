namespace ProxyMity.Application.Handlers.Conversations.Queries.GetUserConversations;

public sealed class GetUserConversationsQueryHandler(
    ILogger<GetUserConversationsQueryHandler> logger,
    IMessageRepository messageRepository,
    IParticipantRepository participantRepository,
    IMessageStatusRepository messageStatusRepository)
        : IQueryHandler<GetUserConversationsQuery, IEnumerable<GetUserConversationsResponse>>
{
    public async Task<IEnumerable<GetUserConversationsResponse>> Handle(
        GetUserConversationsQuery query,
        CancellationToken cancellationToken)
    {
        Ulid userId = query.UserId;

        logger.LogInformation($"Listing conversations of {userId}...");

        var conversationsThatUserParticipate = await participantRepository.GetConversationsByUserIdAsync(userId);

        List<GetUserConversationsResponse> conversations = [];

        foreach (var conversation in conversationsThatUserParticipate)
        {
            var participants = await participantRepository.GetParticipantsByConversationIdAsync(conversation.Id);
            var lastMessages = await messageRepository.GetMessagesFromConversationAsync(conversation.Id, 3);

            int unreadMessagesCount = conversation.GroupId is not null
                ? await messageStatusRepository.GetUnreadMessagesStatusCountByUserIdAsync(userId, conversation.Id)
                : await messageRepository.GetUnreadConversationMessagesCountAsync(userId, conversation.Id);

            var viewModel = new GetUserConversationsResponse(conversation, unreadMessagesCount, participants, lastMessages);

            conversations.Add(viewModel);
        }

        return conversations;
    }
}
