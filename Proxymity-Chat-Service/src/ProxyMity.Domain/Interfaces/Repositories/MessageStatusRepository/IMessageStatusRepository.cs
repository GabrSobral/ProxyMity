namespace ProxyMity.Domain.Interfaces.Repositories.MessageStatusRepository;

public interface IMessageStatusRepository
{
    public Task CreateAsync(MessageStatus messageStatus, CancellationToken cancellationToken);
    public Task UpdateStatusAsync(Ulid userId, Ulid messageId, Ulid conversationId, EMessageStatuses status, CancellationToken cancellationToken);
    public Task ReceiveUnreceivedMessagesByUserIdAsync(Ulid userId, CancellationToken cancellationToken);
    public Task ReadUnreadMessagesByUserIdAsync(Ulid userId, Ulid conversationId, CancellationToken cancellationToken);
    public Task<IEnumerable<MessageStatus>> GetUnreadMessagesStatusFromConversationByIdAsync(Ulid conversationId, CancellationToken cancellationToken);
    public Task<int> GetUnreadMessagesStatusCountByUserIdAsync(Ulid userId, Ulid conversationId, CancellationToken cancellationToken);
    public Task<List<MessageStatus>> GetMessagesStatusByMessageIdAsync(Ulid messageId, Ulid conversationId, CancellationToken cancellationToken);

}
