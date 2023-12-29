namespace ProxyMity.Domain.Interfaces.Repositories.ParticipantRepository.CustomQueries;

public record GetConversationsByUserIdQuery(
    Ulid Id,
    DateTime CreatedAt,
    string? GroupName,
    string? GroupDescription,
    Ulid? GroupId
);
