namespace ProxyMity.Domain.Interfaces.Repositories.ParticipantRepository;

public interface IParticipantRepository
{
    public Task AddAsync(Participant participant, CancellationToken cancellationToken);
    public Task Remove(Participant participant, CancellationToken cancellationToken);
    public Task PinConversation(Ulid conversationId, Ulid userId, CancellationToken cancellationToken);
    public Task UnpinConversation(Ulid conversationId, Ulid userId, CancellationToken cancellationToken);
    public Task<Participant?> GetByIdAsync(Ulid userId, Ulid conversationId, CancellationToken cancellationToken);
    public Task<List<Participant>> GetByUserIdAsync(Ulid userId, CancellationToken cancellationToken);
    public Task<List<Participant>> GetByConversationIdAsync(Ulid conversationId, CancellationToken cancellationToken);
    public Task<List<GetConversationsByUserIdQuery>> GetConversationsByUserIdAsync(Ulid userId, CancellationToken cancellationToken);
    public Task<List<GetParticipantsByConversationIdQuery>> GetParticipantsByConversationIdAsync(Ulid conversationId, CancellationToken cancellationToken);
}
