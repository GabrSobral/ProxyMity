namespace ProxyMity.Application.Handlers.Friendships.Commands.CreateFriendshipInvite;

public sealed class CreateFriendshipInviteCommandHandler(
    ILogger<CreateFriendshipInviteCommandHandler> logger,
    IFriendshipRepository friendshipRepository,
    DataContext dbContext) : ICommandHandler<CreateFriendshipInviteCommand>
{
    public async Task Handle(CreateFriendshipInviteCommand command, CancellationToken cancellationToken)
    {
        var ( requesterUserId, targetUserId ) = command;
        
        var friendshipAlreadyExist =
            await friendshipRepository.GetFriendshipInvite(requesterUserId, targetUserId,
                cancellationToken);

        if (friendshipAlreadyExist is not null)
            throw new FriendshipAlreadyExistException(requesterUserId, targetUserId);

        var newFriendship = Friendship.Create(requesterUserId, targetUserId);

        await friendshipRepository.Create(newFriendship, cancellationToken);

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}