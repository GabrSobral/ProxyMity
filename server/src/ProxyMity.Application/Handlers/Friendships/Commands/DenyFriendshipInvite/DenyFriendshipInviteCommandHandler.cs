namespace ProxyMity.Application.Handlers.Friendships.Commands.DenyFriendshipInvite;

public sealed class DenyFriendshipInviteCommandHandler(
    ILogger<DenyFriendshipInviteCommand> logger,
    IFriendshipRepository friendshipRepository,
    DataContext dbContext
    ) : ICommandHandler<DenyFriendshipInviteCommand, DateTime>
{
    public async Task<DateTime> Handle(DenyFriendshipInviteCommand command, CancellationToken cancellationToken)
    {
        var friendship = await friendshipRepository.GetFriendshipInvite(command.RequesterUserId, command.CurrentUserId, cancellationToken)
            ?? throw new FriendshipNotFoundException(command.RequesterUserId, command.CurrentUserId);

        var timestamp = friendship.Deny(command.CurrentUserId);

        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation($"The user '{command.CurrentUserId}' accepted friendship invitation from '{command.RequesterUserId}'");
        return timestamp;
    }
}