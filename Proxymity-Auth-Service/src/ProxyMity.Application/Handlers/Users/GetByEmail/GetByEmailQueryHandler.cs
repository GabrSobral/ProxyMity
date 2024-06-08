namespace ProxyMity.Application.Handlers.Users.GetByEmail;

public class GetByEmailQueryHandler(
    ILogger<GetByEmailQueryHandler> logger,
    IUserRepository userRepository
) : IQueryHandler<GetByEmailQuery, GetByEmailResponse>
{
    public async Task<GetByEmailResponse> Handle(GetByEmailQuery query, CancellationToken cancellationToken)
    {
        var userEmail = query.Email;

        logger.LogInformation($"Searching for user e-mail: {userEmail}");

        var user = await userRepository.FindByEmailAsync(userEmail, cancellationToken)
            ?? throw new UserNotFoundException(userEmail);

        return new GetByEmailResponse(user);
    }
}
