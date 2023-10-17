namespace ProxyMity.Domain.Interfaces.Repositories.ParticipantRepository.CustomQueries;

public record GetParticipantsByConversationIdQuery(
    Guid Id,
    string Name,
    string Email,
    string? PhotoUrl,
    DateTime? LastOnline,
    DateTime CreatedAt,
    DateTime? RemovedAt
);
