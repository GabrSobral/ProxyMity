namespace ProxyMity.Application.Handlers.Authentication.ConfirmEmail;

public record ConfirmEmailCommand(
    Guid Token
): ICommand;
