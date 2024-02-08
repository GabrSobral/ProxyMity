namespace ProxyMity.Domain.Interfaces.Repositories.FriendshipRepository;

public interface IFriendshipRepository
{
    public Task Create(Friendship friendship, CancellationToken cancellationToken);

    public Task<Friendship?> GetFriendshipInvite(Ulid requesterId, Ulid targetId, CancellationToken cancellationToken);
    
    public Task Accept(Ulid currentUserId, Ulid requesterUserId, CancellationToken cancellationToken);
    
    public Task Deny(Ulid currentUserId, Ulid requesterUserId, CancellationToken cancellationToken);
}