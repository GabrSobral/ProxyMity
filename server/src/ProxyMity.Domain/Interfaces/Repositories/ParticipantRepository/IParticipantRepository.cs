namespace ProxyMity.Domain.Interfaces.Repositories.ParticipantRepository;

public interface IParticipantRepository
{
    public Task AddAsync(Participant participant, CancellationToken cancellationToken);
    public Task RemoveAsync(Participant participant, CancellationToken cancellationToken);
    public Task<Participant?> GetByIdAsync(Guid userId, Guid conversationId);
    public Task<IEnumerable<Participant>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken);
    public Task<IEnumerable<Participant>> GetByConversationIdAsync(Guid conversationId, CancellationToken cancellationToken);
    public Task<IEnumerable<GetConversationsByUserIdQuery>> GetConversationsByUserIdAsync(Guid userId, CancellationToken cancellationToken);
    public Task<IEnumerable<GetParticipantsByConversationIdQuery>> GetParticipantsByConversationIdAsync(Guid conversationId, CancellationToken cancellationToken);
}
