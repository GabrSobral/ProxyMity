namespace ProxyMity.Domain.Interfaces.Repositories.MessageRepository;

public interface IMessageRepository
{
    public Task CreateAsync(Message message, CancellationToken cancellationToken);
    public Task UpdateStatusAsync(Guid messageId, EMessageStatuses status, CancellationToken cancellationToken);
    public Task ReadUnreadMessagesByConversationIdAsync(Guid userId, Guid conversationId, CancellationToken cancellationToken);
    public Task<int> GetUnreadConversationMessagesCountAsync(Guid userId, Guid conversationId, CancellationToken cancellationToken);
    public Task<IEnumerable<Message>> GetMessagesFromConversationAsync(Guid conversationId, int quantity, CancellationToken cancellationToken);
}
