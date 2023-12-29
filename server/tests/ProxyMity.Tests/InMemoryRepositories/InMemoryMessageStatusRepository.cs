using ProxyMity.Domain.Interfaces.Repositories.MessageStatusRepository;

namespace ProxyMity.Unit.InMemoryRepositories;

internal class InMemoryMessageStatusRepository : InMemoryRepository<MessageStatus>, IMessageStatusRepository {
    public Task CreateAsync(MessageStatus messageStatus) {
        Items.Add(messageStatus);

        return Task.CompletedTask;
    }

    public async Task<IEnumerable<MessageStatus>> GetMessagesStatusByMessageIdAsync(Ulid messageId, Ulid conversationId) {
        await Task.Run(() => { });

        return Items.Where(x => x.MessageId == messageId && x.ConversationId == conversationId);
    }

    public async Task<int> GetUnreadMessagesStatusCountByUserIdAsync(Ulid userId, Ulid conversationId) {
        await Task.Run(() => { });

        return Items.Where(x => x.UserId == userId && x.ConversationId == conversationId && x.ReadAt == null).Count();
    }

    public async Task<IEnumerable<MessageStatus>> GetUnreadMessagesStatusFromConversationByIdAsync(Ulid conversationId) {
        await Task.Run(() => { });

        return Items.Where(x => x.ConversationId == conversationId);
    }

    public Task ReadAsync(Ulid userId, Ulid messageId) {
        foreach (var item in Items) {
            if (item.UserId == userId && item.MessageId == messageId) {
                item.Read();
            }
        }

        return Task.CompletedTask;
    }

    public Task ReadUnreadMessagesByUserIdAsync(Ulid userId, Ulid conversationId) {
        foreach (var item in Items) {
            if (item.UserId == userId && item.ConversationId == conversationId) {
                item.Read();
            }
        }

        return Task.CompletedTask;
    }

    public Task ReceiveAsync(Ulid userId, Ulid messageId) {
        foreach (var item in Items) {
            if (item.UserId == userId && item.MessageId == messageId) {
                item.Receive();
            }
        }

        return Task.CompletedTask;
    }
}
