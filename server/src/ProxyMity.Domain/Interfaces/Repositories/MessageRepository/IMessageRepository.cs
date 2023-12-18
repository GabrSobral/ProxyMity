namespace ProxyMity.Domain.Interfaces.Repositories.MessageRepository;

public interface IMessageRepository
{
    public Task CreateAsync(Message message);
    public Task UpdateStatusAsync(Guid messageId, EMessageStatuses status);
    public Task ReadUnreadMessagesByConversationIdAsync(Guid userId, Guid conversationId);
    public Task<int> GetUnreadConversationMessagesCountAsync(Guid userId, Guid conversationId);
    public Task<IEnumerable<Message>> GetMessagesFromConversationAsync(Guid conversationId, int quantity);
}
