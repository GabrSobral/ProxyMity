namespace ProxyMity.Application.Handlers.Users.Commands.ChangePassword;

public record ChangePasswordCommand(
    Guid UserId,
    string CurrentPassword,
    string NewPassword
): ICommand;

public record ChangePasswordRequest(
    string CurrentPassword,
    string NewPassword
) : ICommand;
