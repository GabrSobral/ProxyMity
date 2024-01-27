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

        var conversationsThatUserParticipate = await participantRepository.GetConversationsByUserIdAsync(userId, cancellationToken);

        GetUserConversationsResponse[] conversations = new GetUserConversationsResponse[conversationsThatUserParticipate.Count];

        for (int i = 0; i < conversationsThatUserParticipate.Count; i++)
        {
            var conversation = conversationsThatUserParticipate[i];

            var participants = await participantRepository.GetParticipantsByConversationIdAsync(conversation.Id, cancellationToken);
            var lastMessages = await messageRepository.GetMessagesFromConversationAsync(conversation.Id, 1, cancellationToken);

            int unreadMessagesCount = conversation.GroupId is not null
                ? await messageStatusRepository.GetUnreadMessagesStatusCountByUserIdAsync(userId, conversation.Id, cancellationToken)
                : await messageRepository.GetUnreadConversationMessagesCountAsync(userId, conversation.Id, cancellationToken);

            conversations[i] = new GetUserConversationsResponse(conversation, unreadMessagesCount, participants, lastMessages);
        }

        Array.Sort(
            conversations,
            (curr, prev) =>
            {
                DateTime currDate = curr.LastMessages.Any() ? curr.LastMessages.ElementAt(0).WrittenAt : DateTime.MinValue;
                DateTime prevDate = prev.LastMessages.Any() ? prev.LastMessages.ElementAt(0).WrittenAt : DateTime.MinValue;
                return prevDate.CompareTo(currDate); // Reversed order here
            }
        );

        return conversations;
    }
}
