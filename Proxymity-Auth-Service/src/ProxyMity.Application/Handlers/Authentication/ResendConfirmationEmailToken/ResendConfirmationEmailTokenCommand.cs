namespace ProxyMity.Application.Handlers.Authentication.ResendConfirmationEmailToken;

public record ResendConfirmationEmailTokenCommand(
    string UserEmail
) : ICommand;
