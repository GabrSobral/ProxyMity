namespace ProxyMity.Application.Handlers.Users.GetByEmail;

public class GetByEmailQueryHandler : IQueryHandler<GetByEmailQuery, GetByEmailResponse> {
    private readonly ILogger<GetByEmailQueryHandler> _logger;
    private readonly IUserRepository _userRepository;

    public GetByEmailQueryHandler(ILogger<GetByEmailQueryHandler> logger, IUserRepository userRepository) {
        _logger = logger;
        _userRepository = userRepository;
    }

    public async Task<GetByEmailResponse> Handle(GetByEmailQuery request, CancellationToken cancellationToken) {
        var userEmail = request.Email;

        _logger.LogInformation($"Searching for user e-mail: {userEmail}");

        var user = await _userRepository.FindByEmailAsync(userEmail)
            ?? throw new UserNotFoundException(userEmail);

        return new GetByEmailResponse(user);
    }
}
