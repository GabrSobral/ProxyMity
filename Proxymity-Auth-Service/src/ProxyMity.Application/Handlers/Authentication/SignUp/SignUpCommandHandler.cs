namespace ProxyMity.Application.Handlers.Authentication.SignUp;

public sealed class SignUpCommandHandler(
    ILogger<SignUpCommandHandler> logger,
    IUserRepository userRepository,

    IJsonWebToken jsonWebToken,
    IPasswordEncrypter passwordEncrypter,

    DataContext dbContext
) : ICommandHandler<SignUpCommand, SignInResponse>
{
    public async Task<SignInResponse> Handle(SignUpCommand command, CancellationToken cancellationToken)
    {
        var userId = Ulid.NewUlid();

        User newUser = new()
        {
            Id = userId,
            FirstName = command.FirstName,
            LastName = command.LastName,
            Email = command.Email.ToLower(),
            PasswordHash = passwordEncrypter.Encrypt(command.Password, userId),
            CreatedAt = DateTime.UtcNow,
            LastOnline = null
        };

        await userRepository.CreateAsync(newUser, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation($"An user was created at application: {newUser.Email}");

        var token = jsonWebToken.Sign(newUser);

        return new SignInResponse(newUser, token);
    }
}
