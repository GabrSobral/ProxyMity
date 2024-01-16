namespace ProxyMity.Unit.InMemoryRepositories;

public class InMemoryConversationRepository : InMemoryRepository<Conversation>, IConversationRepository {
    public async Task CreateAsync(Conversation newConversation, CancellationToken cancellationToken) {
        await Task.Run(() => { 
            Items.Add(newConversation);
        }, cancellationToken);
    }

    public async Task DisableConversationByIdAsync(Ulid conversationId, CancellationToken cancellationToken) {
        await Task.Run(() => { 
            foreach (var item in Items) {
                if (item.Id == conversationId)
                    item.DisabledAt = DateTime.UtcNow;
            }
        }, cancellationToken);
    }

    public async Task<Conversation?> GetByIdAsync(Ulid conversationId, CancellationToken cancellationToken) {
        await Task.Run(() => { }, cancellationToken);

        return Items.SingleOrDefault(x => x.Id == conversationId);
    }
}
