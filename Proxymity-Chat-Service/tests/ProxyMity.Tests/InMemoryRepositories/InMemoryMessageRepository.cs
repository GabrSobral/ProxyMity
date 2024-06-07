namespace ProxyMity.Unit.InMemoryRepositories;

internal class InMemoryMessageRepository : InMemoryRepository<Message>, IMessageRepository {
    public async Task<Message?> GetById(Ulid messageId, CancellationToken cancellationToken) {
        await Task.Run(() => { }, cancellationToken);
        
        return Items.FirstOrDefault(x => x.Id == messageId);
    }

    public async Task CreateAsync(Message message, CancellationToken cancellationToken) {
        await Task.Run(() => { 
            Items.Add(message);
        }, cancellationToken);
    }

    public async Task<IEnumerable<Message>> GetMessagesFromConversationAsync(Ulid conversationId, int quantity, CancellationToken cancellationToken) {
        await Task.Run(() => { });

        var messagesFromConversation = Items.Where(x => x.ConversationId == conversationId);
        var orderedMessages = messagesFromConversation.OrderByDescending(x => x.WrittenAt);

        return orderedMessages.Take(quantity);
    }

    public async Task<int> GetUnreadConversationMessagesCountAsync(Ulid userId, Ulid conversationId, CancellationToken cancellationToken) {
        await Task.Run(() => { }, cancellationToken);

        var unreadMessagesFromConversation = Items.Where(x => x.ConversationId == conversationId && x.ReadByAll == null);

        return unreadMessagesFromConversation.Count();
    }

    public Task ReadUnreadMessagesByConversationIdAsync(Ulid userId, Ulid conversationId, CancellationToken cancellationToken) {
        var messagesFromConversation = Items.Where(x => x.ConversationId == conversationId);

        foreach (var item in messagesFromConversation) {
            if (item.AuthorId != userId)
                item.ReadByAll();
        }

        return Task.CompletedTask;
    }

    public Task UpdateStatusAsync(Ulid messageId, EMessageStatuses status, CancellationToken cancellationToken) {
        for (int i = 0; i < Items.Count; i++) {
            if (Items.ElementAt(i).Id != messageId)
                continue;

            switch (status) {
                case EMessageStatuses.READ:
                    Items.ElementAt(i).ReadByAll();
                    break;

                case EMessageStatuses.SENT:
                    Items.ElementAt(i).Send();
                    break;

                case EMessageStatuses.RECEIVED:
                    Items.ElementAt(i).ReceiveByAll();
                    break;
            }
        }

        return Task.CompletedTask;
    }
}
