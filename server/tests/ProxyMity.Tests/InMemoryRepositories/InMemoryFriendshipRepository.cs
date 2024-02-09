namespace ProxyMity.Unit.InMemoryRepositories;

public class InMemoryFriendshipRepository: InMemoryRepository<Friendship>, IFriendshipRepository {
    public async Task Create(Friendship friendship, CancellationToken cancellationToken) {
        await Task.Run(() => { }, cancellationToken);
        Items.Add(friendship);
    }

    public async Task<Friendship?> GetFriendshipInvite(Ulid requesterId, Ulid targetId, CancellationToken cancellationToken) {
        await Task.Run(() => { }, cancellationToken);

        return Items.SingleOrDefault(x => x.RequesterId == requesterId && x.TargetId == targetId);
    }
}