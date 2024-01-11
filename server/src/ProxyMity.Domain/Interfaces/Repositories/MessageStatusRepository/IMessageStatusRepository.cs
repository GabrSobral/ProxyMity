namespace ProxyMity.Domain.Interfaces.Repositories.MessageStatusRepository;

public interface IMessageStatusRepository
{
    public Task CreateAsync(MessageStatus messageStatus);
    public Task ReceiveAsync(Ulid userId, Ulid messageId);
    public Task ReadAsync(Ulid userId, Ulid messageId);
    public Task ReceiveUnreceivedMessagesByUserIdAsync(Ulid userId);
    public Task ReadUnreadMessagesByUserIdAsync(Ulid userId, Ulid conversationId);
    public Task<IEnumerable<MessageStatus>> GetUnreadMessagesStatusFromConversationByIdAsync(Ulid conversationId);
    public Task<int> GetUnreadMessagesStatusCountByUserIdAsync(Ulid userId, Ulid conversationId);
    public Task<IEnumerable<MessageStatus>> GetMessagesStatusByMessageIdAsync(Ulid messageId, Ulid conversationId);
}
