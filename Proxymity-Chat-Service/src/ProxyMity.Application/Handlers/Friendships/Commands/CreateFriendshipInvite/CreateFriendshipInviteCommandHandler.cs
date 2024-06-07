namespace ProxyMity.Application.Handlers.Friendships.Commands.CreateFriendshipInvite;

public sealed class CreateFriendshipInviteCommandHandler(
    ILogger<CreateFriendshipInviteCommandHandler> logger,
    IFriendshipRepository friendshipRepository,
    DataContext dbContext) : ICommandHandler<CreateFriendshipInviteCommand, Friendship>
{
    public async Task<Friendship> Handle(CreateFriendshipInviteCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation($"The user {command.RequesterUserId} is requesting the user {command.TargetUserId} to a friendship.");

        var ( requesterUserId, targetUserId ) = command;
        
        var friendshipAlreadyExist =
            await friendshipRepository.GetFriendshipInvite(requesterUserId, targetUserId,
                cancellationToken);

        if (friendshipAlreadyExist is not null)
            throw new FriendshipAlreadyExistException(requesterUserId, targetUserId);

        var newFriendship = Friendship.Create(requesterUserId, targetUserId);

        await friendshipRepository.Create(newFriendship, cancellationToken);

        await dbContext.SaveChangesAsync(cancellationToken);

        return newFriendship;
    }
}