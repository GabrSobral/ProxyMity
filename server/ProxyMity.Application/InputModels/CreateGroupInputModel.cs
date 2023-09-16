namespace ProxyMity.Application.InputModels;
public record CreateGroupInputModel(string Name, string? Description, List<Guid> Participants);