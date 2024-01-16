namespace ProxyMity.Domain.Interfaces.Repositories.GroupRepository;

public interface IGroupRepository
{
    public Task CreateAsync(Group newGroup, CancellationToken cancellationToken);
    public Task<Group?> FindByIdAsync(Ulid groupId, CancellationToken cancellationToken);
}
