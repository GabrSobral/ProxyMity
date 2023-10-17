namespace ProxyMity.Domain.Interfaces.Repositories.MessageStatusRepository;

public interface IMessageStatusRepository {
    public Task CreateAsync(MessageStatus messageStatus);
    public Task ReceiveAsync(Guid userId, Guid messageId);
    public Task ReadAsync(Guid userId, Guid messageId);
    public Task ReadUnreadMessagesByUserIdAsync(Guid userId, Guid conversationId);
    public Task<IEnumerable<MessageStatus>> GetUnreadMessagesStatusFromConversationByIdAsync(Guid conversationId);
    public Task<int> GetUnreadMessagesStatusCountByUserIdAsync(Guid userId, Guid conversationId);
    public Task<IEnumerable<MessageStatus>> GetMessagesStatusByMessageIdAsync(Guid messageId, Guid conversationId);
}
