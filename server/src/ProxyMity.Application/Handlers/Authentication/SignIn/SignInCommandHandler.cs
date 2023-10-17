namespace ProxyMity.Application.Handlers.Authentication.SignIn;

public class SignInCommandHandler : ICommandHandler<SignInCommand, SignInResponse> {
    private readonly ILogger<SignInCommandHandler> _logger;
    private readonly IJsonWebToken _jsonWebToken;
    private readonly IUserRepository _userRepository;
    private readonly IPasswordEncrypter _passwordEncrypter;

    public SignInCommandHandler(
        ILogger<SignInCommandHandler> logger,
        IJsonWebToken jsonWebToken,
        IUserRepository userRepository,
        IPasswordEncrypter passwordEncrypter
    ) {
        _logger = logger;
        _jsonWebToken = jsonWebToken;
        _userRepository = userRepository;
        _passwordEncrypter = passwordEncrypter;
    }

    public async Task<SignInResponse> Handle(SignInCommand request, CancellationToken cancellationToken) {
        var user = await _userRepository.FindByEmailAsync(request.Email.ToLower())
            ?? throw new EmailOrPasswordInvalidException();

        var isPasswordCorrect = _passwordEncrypter.Compare(user.Password, request.Password, user.Id);

        if (!isPasswordCorrect)
            throw new EmailOrPasswordInvalidException();

        _logger.LogInformation($"An user was logged at application: {user.Email}");

        var token = _jsonWebToken.Sign(user);

        return new SignInResponse(user, token);
    }
}
