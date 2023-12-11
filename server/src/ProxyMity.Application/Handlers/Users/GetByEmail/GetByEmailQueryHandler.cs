namespace ProxyMity.Application.Handlers.Users.GetByEmail;

public class GetByEmailQueryHandler(
    ILogger<GetByEmailQueryHandler> logger,
    IUserRepository userRepository
) : IQueryHandler<GetByEmailQuery, GetByEmailResponse>
{
    public async Task<GetByEmailResponse> Handle(GetByEmailQuery request, CancellationToken cancellationToken)
    {
        var userEmail = request.Email;

        logger.LogInformation($"Searching for user e-mail: {userEmail}");

        var user = await userRepository.FindByEmailAsync(userEmail)
            ?? throw new UserNotFoundException(userEmail);

        return new GetByEmailResponse(user);
    }
}
