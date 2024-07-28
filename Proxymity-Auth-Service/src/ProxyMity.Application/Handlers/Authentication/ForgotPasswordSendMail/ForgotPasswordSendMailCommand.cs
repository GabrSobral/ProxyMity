namespace ProxyMity.Application.Handlers.Authentication.ForgotPasswordSendMail;

public record ForgotPasswordSendMailCommand(    
    string Email
): ICommand;
