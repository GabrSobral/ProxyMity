namespace ProxyMity.Domain.Interfaces.Repositories.ParticipantRepository;

public interface IParticipantRepository {
    public Task AddAsync(Participant participant);
    public Task RemoveAsync(Participant participant);
    public Task<Participant?> GetByIdAsync(Guid userId, Guid conversationId);
    public Task<IEnumerable<Participant>> GetByUserIdAsync(Guid userId);
    public Task<IEnumerable<Participant>> GetByConversationIdAsync(Guid conversationId);
    public Task<IEnumerable<GetConversationsByUserIdQuery>> GetConversationsByUserIdAsync(Guid userId);
    public Task<IEnumerable<GetParticipantsByConversationIdQuery>> GetParticipantsByConversationIdAsync(Guid conversationId);
}
