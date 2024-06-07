namespace ProxyMity.Domain.Interfaces.Repositories.MessageRepository;

public interface IMessageRepository
{
    public Task<Message?> GetById(Ulid messageId, CancellationToken cancellationToken);
    public Task CreateAsync(Message message, CancellationToken cancellationToken);
    public Task UpdateStatusAsync(Ulid messageId, EMessageStatuses status, CancellationToken cancellationToken);
    public Task ReadUnreadMessagesByConversationIdAsync(Ulid userId, Ulid conversationId, CancellationToken cancellationToken);
    public Task<int> GetUnreadConversationMessagesCountAsync(Ulid userId, Ulid conversationId, CancellationToken cancellationToken);
    public Task<IEnumerable<Message>> GetMessagesFromConversationAsync(Ulid conversationId, int quantity, CancellationToken cancellationToken);
}
