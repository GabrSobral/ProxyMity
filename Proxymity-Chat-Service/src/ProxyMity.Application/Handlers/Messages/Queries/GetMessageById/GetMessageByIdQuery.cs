namespace ProxyMity.Application.Handlers.Messages.Queries.GetMessageById;

public record GetMessageByIdQuery(
    Ulid MessageId
): IQuery<Message>;
