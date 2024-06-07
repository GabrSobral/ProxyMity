namespace ProxyMity.Application.Handlers.Messages.Queries.GetStatusFromMessage;

public record GetStatusFromMessageQuery(
    Ulid MessageId,
    Ulid ConversationId
): IQuery<IEnumerable<GetStatusFromMessageResponse>>;

public record GetStatusFromMessageResponse(
    Ulid MessageId,
    Ulid UserId,
    DateTime? ReadAt,
    DateTime? ReceivedAt
);
