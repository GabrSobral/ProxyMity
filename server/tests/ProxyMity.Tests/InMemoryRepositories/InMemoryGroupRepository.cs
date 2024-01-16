namespace ProxyMity.Unit.InMemoryRepositories;

public class InMemoryGroupRepository : InMemoryRepository<Group>, IGroupRepository {
    public async Task CreateAsync(Group newGroup, CancellationToken cancellationToken) {
        await Task.Run(() => { 
            Items.Add(newGroup);
        }, cancellationToken);
    }

    public async Task<Group?> FindByIdAsync(Ulid groupId, CancellationToken cancellationToken) {
        await Task.Run(() => { }, cancellationToken);

        return Items.SingleOrDefault(x => x.Id == groupId);
    }
}
