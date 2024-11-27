namespace ProxyMity.Application.Handlers.Users.Commands.UpdateUserData;

public record UpdateUserDataCommand(
    Guid UserId,
    
    string? FirstName,
    string? LastName
): ICommand;

public record UpdateUserDataRequest(
    string? FirstName,
    string? LastName
);
