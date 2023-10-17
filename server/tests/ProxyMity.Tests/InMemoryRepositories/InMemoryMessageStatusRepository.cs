using ProxyMity.Domain.Interfaces.Repositories.MessageStatusRepository;

namespace ProxyMity.Unit.InMemoryRepositories;

internal class InMemoryMessageStatusRepository : InMemoryRepository<MessageStatus>, IMessageStatusRepository {
    public Task CreateAsync(MessageStatus messageStatus) {
        Items.Add(messageStatus);

        return Task.CompletedTask;
    }

    public async Task<IEnumerable<MessageStatus>> GetMessagesStatusByMessageIdAsync(Guid messageId, Guid conversationId) {
        await Task.Run(() => { });

        return Items.Where(x => x.MessageId == messageId && x.ConversationId == conversationId);
    }

    public async Task<int> GetUnreadMessagesStatusCountByUserIdAsync(Guid userId, Guid conversationId) {
        await Task.Run(() => { });

        return Items.Where(x => x.UserId == userId && x.ConversationId == conversationId && x.ReadAt == null).Count();
    }

    public async Task<IEnumerable<MessageStatus>> GetUnreadMessagesStatusFromConversationByIdAsync(Guid conversationId) {
        await Task.Run(() => { });

        return Items.Where(x => x.ConversationId == conversationId);
    }

    public Task ReadAsync(Guid userId, Guid messageId) {
        foreach (var item in Items) {
            if (item.UserId == userId && item.MessageId == messageId) {
                item.Read();
            }
        }

        return Task.CompletedTask;
    }

    public Task ReadUnreadMessagesByUserIdAsync(Guid userId, Guid conversationId) {
        foreach (var item in Items) {
            if (item.UserId == userId && item.ConversationId == conversationId) {
                item.Read();
            }
        }

        return Task.CompletedTask;
    }

    public Task ReceiveAsync(Guid userId, Guid messageId) {
        foreach (var item in Items) {
            if (item.UserId == userId && item.MessageId == messageId) {
                item.Receive();
            }
        }

        return Task.CompletedTask;
    }
}
