namespace ProxyMity.Domain.Interfaces.Repositories.ConversationRepository;

public interface IConversationRepository
{
    public Task CreateAsync(Conversation newConversation, CancellationToken cancellationToken);
    public Task<Conversation?> GetByIdAsync(Guid conversationId, CancellationToken cancellationToken);
}
