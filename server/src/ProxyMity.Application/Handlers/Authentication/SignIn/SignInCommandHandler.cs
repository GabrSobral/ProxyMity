namespace ProxyMity.Application.Handlers.Authentication.SignIn;

public class SignInCommandHandler(
    ILogger<SignInCommandHandler> logger,
    IJsonWebToken jsonWebToken,
    IUserRepository userRepository,
    IPasswordEncrypter passwordEncrypter) : ICommandHandler<SignInCommand, SignInResponse>
{
    public async Task<SignInResponse> Handle(SignInCommand command, CancellationToken cancellationToken)
    {
        var user = await userRepository.FindByEmailAsync(command.Email.ToLower())
            ?? throw new EmailOrPasswordInvalidException();

        var isPasswordCorrect = passwordEncrypter.Compare(user.Password, command.Password, user.Id);

        if (!isPasswordCorrect)
            throw new EmailOrPasswordInvalidException();

        logger.LogInformation($"An user was logged at application: {user.Email}");

        var token = jsonWebToken.Sign(user);

        return new SignInResponse(user, token);
    }
}
