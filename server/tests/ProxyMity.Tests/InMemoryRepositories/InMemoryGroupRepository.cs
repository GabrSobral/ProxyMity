namespace ProxyMity.Unit.InMemoryRepositories;

public class InMemoryGroupRepository : InMemoryRepository<Group>, IGroupRepository {
    public Task CreateAsync(Group newGroup) {
        Items.Add(newGroup);

        return Task.CompletedTask;
    }

    public async Task<Group?> FindByIdAsync(Ulid groupId) {
        await Task.Run(() => { });

        return Items.SingleOrDefault(x => x.Id == groupId);
    }
}
