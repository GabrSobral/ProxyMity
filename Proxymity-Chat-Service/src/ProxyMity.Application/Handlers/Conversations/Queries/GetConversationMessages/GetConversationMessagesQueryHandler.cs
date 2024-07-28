
namespace ProxyMity.Application.Handlers.Conversations.Queries.GetConversationMessages;

public sealed class GetConversationMessagesQueryHandler(
    IMessageRepository messageRepository,
    IConversationRepository conversationRepository) 
        : IQueryHandler<GetConversationMessagesQuery, IEnumerable<Message>>
{
    public async Task<IEnumerable<Message>> Handle(
        GetConversationMessagesQuery query, 
        CancellationToken cancellationToken)
    {
        _ = await conversationRepository.GetByIdAsync(query.ConversationId, cancellationToken)
            ?? throw new ConversationNotFoundException(query.ConversationId);

        IEnumerable<Message> messages = await messageRepository.GetMessagesFromConversationAsync(query.ConversationId, 100, cancellationToken);

        return messages;
    }
}
