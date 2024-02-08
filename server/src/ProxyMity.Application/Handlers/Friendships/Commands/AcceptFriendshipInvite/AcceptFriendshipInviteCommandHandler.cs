namespace ProxyMity.Application.Handlers.Friendships.Commands.AcceptFriendshipInvite;

public sealed class AcceptFriendshipInviteCommandHandler(
    ILogger<AcceptFriendshipInviteCommand> logger,
    IFriendshipRepository friendshipRepository,
    DataContext dbContext
    ) : ICommandHandler<AcceptFriendshipInviteCommand, DateTime>
{
    public async Task<DateTime> Handle(AcceptFriendshipInviteCommand command, CancellationToken cancellationToken)
    {
        var friendship = await friendshipRepository.GetFriendshipInvite(command.RequesterUserId, command.CurrentUserId, cancellationToken)
            ?? throw new FriendshipNotFoundException(command.RequesterUserId, command.CurrentUserId);

        var timestamp = friendship.Accept(command.CurrentUserId);

        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation($"The user '{command.CurrentUserId}' accepted friendship invitation from '{command.RequesterUserId}'");
        return timestamp;
    }
}