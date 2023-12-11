namespace ProxyMity.Application.Handlers.Users.GetById;

public class GetByIdQueryHandler(
    ILogger<GetByIdQueryHandler> logger,
    IUserRepository userRepository
) : IQueryHandler<GetByIdQuery, GetByIdResponse>
{
    public async Task<GetByIdResponse> Handle(GetByIdQuery request, CancellationToken cancellationToken)
    {
        var userId = request.Id;

        logger.LogInformation($"Searching for user ID: {userId}");

        var user = await userRepository.FindByIdAsync(userId)
            ?? throw new UserNotFoundException(userId);

        return new GetByIdResponse(user); ;
    }
}
