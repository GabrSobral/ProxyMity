namespace ProxyMity.Application.Handlers.Authentication.SignUp;

public record SignUpCommand(
    string Name,
    string Email,
    string Password
) : ICommand<SignInResponse>;