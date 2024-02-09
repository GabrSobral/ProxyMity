namespace ProxyMity.Application.Handlers.Friendships.Commands.AcceptFriendshipInvite;

public sealed class AcceptFriendshipInviteCommandHandler(
    ILogger<AcceptFriendshipInviteCommandHandler> logger,
    IFriendshipRepository friendshipRepository,
    DataContext dbContext) : ICommandHandler<AcceptFriendshipInviteCommand, DateTime>
{
    public async Task<DateTime> Handle(AcceptFriendshipInviteCommand command, CancellationToken cancellationToken)
    {
        var ( currentUserId, requesterUserId ) = command;
        
        var friendship = await friendshipRepository.GetFriendshipInvite(requesterUserId, currentUserId, cancellationToken)
            ?? throw new FriendshipNotFoundException(requesterUserId, currentUserId);

        var timestamp = friendship.Accept(currentUserId);

        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation($"The user '{currentUserId}' accepted friendship invitation from '{requesterUserId}'");
        return timestamp;
    }
}