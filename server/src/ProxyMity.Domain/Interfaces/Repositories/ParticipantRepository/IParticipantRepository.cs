namespace ProxyMity.Domain.Interfaces.Repositories.ParticipantRepository;

public interface IParticipantRepository
{
    public Task AddAsync(Participant participant);
    public Task RemoveAsync(Participant participant);
    public Task<Participant?> GetByIdAsync(Ulid userId, Ulid conversationId);
    public Task<IEnumerable<Participant>> GetByUserIdAsync(Ulid userId);
    public Task<IEnumerable<Participant>> GetByConversationIdAsync(Ulid conversationId);
    public Task<IEnumerable<GetConversationsByUserIdQuery>> GetConversationsByUserIdAsync(Ulid userId);
    public Task<IEnumerable<GetParticipantsByConversationIdQuery>> GetParticipantsByConversationIdAsync(Ulid conversationId);
}
