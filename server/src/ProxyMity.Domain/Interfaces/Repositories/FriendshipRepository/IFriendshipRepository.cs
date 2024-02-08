namespace ProxyMity.Domain.Interfaces.Repositories.FriendshipRepository;

public interface IFriendshipRepository
{
    public Task Create(Friendship friendship, CancellationToken cancellationToken);

    public Task<Friendship?> GetFriendshipInvite(Ulid requesterId, Ulid targetId, CancellationToken cancellationToken);
}