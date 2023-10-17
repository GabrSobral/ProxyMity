namespace ProxyMity.Application.Handlers.Users.GetById;

public class GetByIdQueryHandler : IQueryHandler<GetByIdQuery, GetByIdResponse> {
    private readonly ILogger<GetByIdQueryHandler> _logger;
    private readonly IUserRepository _userRepository;

    public GetByIdQueryHandler(ILogger<GetByIdQueryHandler> logger, IUserRepository userRepository) {
        _logger = logger;
        _userRepository = userRepository;
    }

    public async Task<GetByIdResponse> Handle(GetByIdQuery request, CancellationToken cancellationToken) {
        var userId = request.Id;

        _logger.LogInformation($"Searching for user ID: {userId}");

        var user = await _userRepository.FindByIdAsync(userId)
            ?? throw new UserNotFoundException(userId);

        return new GetByIdResponse(user); ;
    }
}
