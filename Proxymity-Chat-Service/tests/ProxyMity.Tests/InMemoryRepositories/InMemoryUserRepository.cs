namespace ProxyMity.Unit.InMemoryRepositories;

internal class InMemoryUserRepository : InMemoryRepository<User>, IUserRepository {
    public Task CreateAsync(User newUser, CancellationToken cancellationToken) {
        Items.Add(newUser);

        return Task.CompletedTask;
    }

    public async Task<User?> FindByEmailAsync(string email, CancellationToken cancellationToken) {
        await Task.Run(() => { }, cancellationToken);

        return Items.SingleOrDefault(x => x.Email == email);
    }

    public async Task<User?> FindByIdAsync(Ulid userId, CancellationToken cancellationToken) {
        await Task.Run(() => { }, cancellationToken);

        return Items.SingleOrDefault(x => x.Id == userId);
    }
}
