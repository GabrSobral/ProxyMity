namespace ProxyMity.Domain.Interfaces.Repositories.ConversationRepository;

public interface IConversationRepository
{
    public Task CreateAsync(Conversation conversation, CancellationToken cancellationToken);
    public Task<Conversation?> GetByIdAsync(Ulid conversationId, CancellationToken cancellationToken);
}
