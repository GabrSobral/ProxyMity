namespace ProxyMity.Application.Handlers.Conversations.Queries.GetUserConversations;

public record GetUserConversationsQuery(
    Guid UserId
) : IQuery<IEnumerable<GetUserConversationsResponse>>;

public record GetUserConversationsResponse(
    GetConversationsByUserIdQuery Conversation,
    int UnreadMessagesCount,
    IEnumerable<GetParticipantsByConversationIdQuery> Participants,
    IEnumerable<Message> LastMessages
);

