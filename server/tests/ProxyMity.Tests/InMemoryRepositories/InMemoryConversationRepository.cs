namespace ProxyMity.Unit.InMemoryRepositories;

public class InMemoryConversationRepository : InMemoryRepository<Conversation>, IConversationRepository {
    public Task CreateAsync(Conversation newConversation) {
        Items.Add(newConversation);

        return Task.CompletedTask;
    }

    public Task DisableConversationByIdAsync(Ulid conversationId) {
        foreach (var item in Items) {
            if (item.Id == conversationId)
                item.DisabledAt = DateTime.UtcNow;
        }

        return Task.CompletedTask;
    }

    public async Task<Conversation?> GetByIdAsync(Ulid conversationId) {
        await Task.Run(() => { });

        return Items.SingleOrDefault(x => x.Id == conversationId);
    }
}
