namespace ProxyMity.Domain.Interfaces.Repositories.MessageRepository;

public interface IMessageRepository
{
    public Task CreateAsync(Message message);
    public Task UpdateStatusAsync(Ulid messageId, EMessageStatuses status);
    public Task ReadUnreadMessagesByConversationIdAsync(Ulid userId, Ulid conversationId);
    public Task<int> GetUnreadConversationMessagesCountAsync(Ulid userId, Ulid conversationId);
    public Task<IEnumerable<Message>> GetMessagesFromConversationAsync(Ulid conversationId, int quantity);
}
