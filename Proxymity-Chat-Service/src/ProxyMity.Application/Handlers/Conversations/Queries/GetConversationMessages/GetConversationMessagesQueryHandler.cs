
namespace ProxyMity.Application.Handlers.Conversations.Queries.GetConversationMessages;

public sealed class GetConversationMessagesQueryHandler(
    IMessageRepository messageRepository) 
        : IQueryHandler<GetConversationMessagesQuery, IEnumerable<Message>>
{
    public async Task<IEnumerable<Message>> Handle(
        GetConversationMessagesQuery query, 
        CancellationToken cancellationToken)
    {
        IEnumerable<Message> messages = await messageRepository.GetMessagesFromConversationAsync(query.ConversationId, 100, cancellationToken);

        return messages;
    }
}
