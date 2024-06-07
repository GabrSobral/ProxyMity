
namespace ProxyMity.Application.Handlers.Messages.Queries.GetMessageById;

public sealed class GetMessageByIdQueryHandler(
    ILogger<GetMessageByIdQueryHandler> logger,
    IMessageRepository messageRepository
) : IQueryHandler<GetMessageByIdQuery, Message>
{
    public async Task<Message> Handle(GetMessageByIdQuery query, CancellationToken cancellationToken)
    {
        var message = await messageRepository.GetById(query.MessageId, cancellationToken) 
            ?? throw new MessageNotFoundException(query.MessageId);

        return message;
    }
}
