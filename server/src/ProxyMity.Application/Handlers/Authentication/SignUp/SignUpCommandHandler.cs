namespace ProxyMity.Application.Handlers.Authentication.SignUp;

public sealed class SignUpCommandHandler(
    ILogger<SignUpCommandHandler> logger,
    IJsonWebToken jsonWebToken,
    IUserRepository userRepository,
    IPasswordEncrypter passwordEncrypter,
    IUnitOfWork unitOfWork) : ICommandHandler<SignUpCommand, SignInResponse>
{
    public async Task<SignInResponse> Handle(SignUpCommand command, CancellationToken cancellationToken)
    {
        var userId = Guid.NewGuid();

        User newUser = new()
        {
            Id = userId,
            Name = command.Name,
            Email = command.Email.ToLower(),
            Password = passwordEncrypter.Encrypt(command.Password, userId),
            CreatedAt = DateTime.UtcNow,
            LastOnline = null
        };

        unitOfWork.BeginTransaction();

        await userRepository.CreateAsync(newUser, cancellationToken);
        unitOfWork.Commit();

        logger.LogInformation($"An user was screated at application: {newUser.Email}");

        var token = jsonWebToken.Sign(newUser);
        return new SignInResponse(newUser, token);
    }
}
