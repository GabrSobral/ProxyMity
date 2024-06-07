namespace ProxyMity.Infra.Database.Repositories;

public class FriendshipRepository(DataContext dbContext) : IFriendshipRepository
{
    public async Task Create(Friendship friendship, CancellationToken cancellationToken)
    {
        await dbContext.Friendships.AddAsync(friendship, cancellationToken);
    }

    public async Task<Friendship?> GetFriendshipInvite(Ulid requesterId, Ulid targetId, CancellationToken cancellationToken)
    {
        return await dbContext.Friendships
            .FirstOrDefaultAsync(x => x.RequesterId == requesterId && x.TargetId == targetId, cancellationToken);
    }
}