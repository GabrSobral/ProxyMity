namespace ProxyMity.Domain.Interfaces.Repositories.GroupRepository;

public interface IGroupRepository
{
    public Task CreateAsync(Group newGroup);
    public Task<Group?> FindByIdAsync(Guid groupId);
}
