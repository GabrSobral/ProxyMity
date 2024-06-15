namespace ProxyMity.Application.Handlers.Authentication.ResendConfirmationEmailToken;

public sealed class ResendConfirmationEmailTokenCommandHandler(
    ILogger<ResendConfirmationEmailTokenCommandHandler> logger,
    DataContext dbContext,
    IEmailSender emailSender
) : ICommandHandler<ResendConfirmationEmailTokenCommand>
{
    public async Task Handle(ResendConfirmationEmailTokenCommand command, CancellationToken cancellationToken)
    {
        var user = await dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Email == command.UserEmail, cancellationToken)
        ?? throw new UserNotFoundException(command.UserEmail);

        if (!user.IsActive)
            throw new UserNotActiveException(user.Email);
    }
}
