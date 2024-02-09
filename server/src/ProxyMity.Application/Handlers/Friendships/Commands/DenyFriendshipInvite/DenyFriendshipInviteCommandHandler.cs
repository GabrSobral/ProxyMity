namespace ProxyMity.Application.Handlers.Friendships.Commands.DenyFriendshipInvite;

public sealed class DenyFriendshipInviteCommandHandler(
    ILogger<DenyFriendshipInviteCommandHandler> logger,
    IFriendshipRepository friendshipRepository,
    DataContext dbContext
    ) : ICommandHandler<DenyFriendshipInviteCommand, DateTime>
{
    public async Task<DateTime> Handle(DenyFriendshipInviteCommand command, CancellationToken cancellationToken)
    {
        var ( currentUserId, requesterUserId ) = command;
        
        var friendship = await friendshipRepository.GetFriendshipInvite(requesterUserId, currentUserId, cancellationToken)
            ?? throw new FriendshipNotFoundException(requesterUserId, currentUserId);

        var timestamp = friendship.Deny(currentUserId);

        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation($"The user '{currentUserId}' accepted friendship invitation from '{requesterUserId}'");
        return timestamp;
    }
}