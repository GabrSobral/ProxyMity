namespace ProxyMity.Application.Handlers.Messages.Queries.GetStatusFromMessage;

public sealed class GetStatusFromMessageQueryHandler(
        ILogger<GetStatusFromMessageQueryHandler> logger,
        IMessageStatusRepository messageStatusRepository) 
    : IQueryHandler<GetStatusFromMessageQuery, IEnumerable<GetStatusFromMessageResponse>>
{
    public async Task<IEnumerable<GetStatusFromMessageResponse>> Handle(
        GetStatusFromMessageQuery query, 
        CancellationToken cancellationToken)
    {
        IEnumerable<MessageStatus> statuses = await messageStatusRepository
            .GetMessagesStatusByMessageIdAsync(query.MessageId, query.ConversationId, cancellationToken);

        return statuses.Select(status => new GetStatusFromMessageResponse(
            MessageId: status.MessageId,
            UserId: status.UserId,
            ReadAt: status.ReadAt,
            ReceivedAt: status.ReceivedAt
        ));
    }
}
