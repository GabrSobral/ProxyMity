namespace ProxyMity.Domain.Interfaces.Repositories.ConversationRepository;

public interface IConversationRepository
{
    public Task CreateAsync(Conversation newConversation);
    public Task<Conversation?> GetByIdAsync(Ulid conversationId);
}
