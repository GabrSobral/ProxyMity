namespace ProxyMity.Application.Handlers.Users.GetById;

public class GetByIdQueryHandler(
    ILogger<GetByIdQueryHandler> logger,
    IUserRepository userRepository
) : IQueryHandler<GetByIdQuery, GetByIdResponse>
{
    public async Task<GetByIdResponse> Handle(GetByIdQuery query, CancellationToken cancellationToken)
    {
        var userId = query.Id;

        logger.LogInformation($"Searching for user ID: {userId}");

        var user = await userRepository.FindByIdAsync(userId, cancellationToken)
            ?? throw new UserNotFoundException(userId);

        return new GetByIdResponse(user);
    }
}
