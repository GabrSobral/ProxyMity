namespace ProxyMity.Infra.Database.Repositories;

public sealed class GroupRepository(DataContext dbContext) : IGroupRepository
{
    public async Task CreateAsync(Group newGroup, CancellationToken cancellationToken)
        => await dbContext.Groups.AddAsync(newGroup, cancellationToken);

    public async Task<Group?> FindByIdAsync(Ulid groupId, CancellationToken cancellationToken)
        => await dbContext.Groups
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == groupId, cancellationToken);
}
