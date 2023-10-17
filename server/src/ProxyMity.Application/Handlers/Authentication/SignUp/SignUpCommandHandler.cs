namespace ProxyMity.Application.Handlers.Authentication.SignUp;

public class SignUpCommandHandler : ICommandHandler<SignUpCommand, SignUpResponse> {
    private readonly ILogger<SignUpCommandHandler> _logger;

    private readonly IJsonWebToken _jsonWebToken;
    private readonly IUserRepository _userRepository;
    private readonly IPasswordEncrypter _passwordEncrypter;

    private readonly IUnitOfWork _unitOfWork;

    public SignUpCommandHandler(
        ILogger<SignUpCommandHandler> logger,
        IJsonWebToken jsonWebToken,
        IUserRepository userRepository,
        IPasswordEncrypter passwordEncrypter,
        IUnitOfWork unitOfWork
    ) {
        _logger = logger;
        _jsonWebToken = jsonWebToken;
        _userRepository = userRepository;
        _passwordEncrypter = passwordEncrypter;
        _unitOfWork = unitOfWork;
    }

    public async Task<SignUpResponse> Handle(SignUpCommand request, CancellationToken cancellationToken) {
        var userId = Guid.NewGuid();

        User newUser = new() {
            Id = userId,
            Name = request.Name,
            Email = request.Email.ToLower(),
            Password = _passwordEncrypter.Encrypt(request.Password, userId),
            CreatedAt = DateTime.UtcNow,
            LastOnline = null
        };

        _unitOfWork.BeginTransaction();

        await _userRepository.CreateAsync(newUser);
        _unitOfWork.Commit();

        _logger.LogInformation($"An user was created at application: {newUser.Email}");

        var token = _jsonWebToken.Sign(newUser);
        return new SignUpResponse(newUser, token);
    }
}
