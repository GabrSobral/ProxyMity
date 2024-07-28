namespace ProxyMity.Domain.Interfaces.Repositories.ParticipantRepository.CustomQueries;

public record GetParticipantsByConversationIdQuery(
    Ulid Id,
    string FirstName,
    string LastName,
    string Email,
    string? PhotoUrl,
    DateTime? LastOnline,
    DateTime CreatedAt,
    DateTime? RemovedAt
);
