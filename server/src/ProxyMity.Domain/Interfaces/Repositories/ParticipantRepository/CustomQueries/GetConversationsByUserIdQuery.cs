namespace ProxyMity.Domain.Interfaces.Repositories.ParticipantRepository.CustomQueries;

public record GetConversationsByUserIdQuery(
    Guid Id,
    DateTime? DisabledAt,
    DateTime CreatedAt,
    string? GroupName,
    string? GroupDescription,
    Guid? GroupId
);
