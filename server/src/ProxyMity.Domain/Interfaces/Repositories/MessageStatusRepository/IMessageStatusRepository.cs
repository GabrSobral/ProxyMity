namespace ProxyMity.Domain.Interfaces.Repositories.MessageStatusRepository;

public interface IMessageStatusRepository
{
    public Task CreateAsync(MessageStatus messageStatus, CancellationToken cancellationToken);
    public Task ReceiveAsync(Ulid userId, Ulid messageId, Ulid conversationId, CancellationToken cancellationToken);
    public Task ReadAsync(Ulid userId, Ulid messageId, Ulid conversationId, CancellationToken cancellationToken);
    public Task ReceiveUnreceivedMessagesByUserIdAsync(Ulid userId, CancellationToken cancellationToken);
    public Task ReadUnreadMessagesByUserIdAsync(Ulid userId, Ulid conversationId, CancellationToken cancellationToken);
    public Task<IEnumerable<MessageStatus>> GetUnreadMessagesStatusFromConversationByIdAsync(Ulid conversationId, CancellationToken cancellationToken);
    public Task<int> GetUnreadMessagesStatusCountByUserIdAsync(Ulid userId, Ulid conversationId, CancellationToken cancellationToken);
    public Task<IEnumerable<MessageStatus>> GetMessagesStatusByMessageIdAsync(Ulid messageId, Ulid conversationId, CancellationToken cancellationToken);
}
