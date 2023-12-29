namespace ProxyMity.Unit.InMemoryRepositories;

internal class InMemoryUserRepository : InMemoryRepository<User>, IUserRepository {
    public Task CreateAsync(User newUser) {
        Items.Add(newUser);

        return Task.CompletedTask;
    }

    public async Task<User?> FindByEmailAsync(string email) {
        await Task.Run(() => { });

        return Items.SingleOrDefault(x => x.Email == email);
    }

    public async Task<User?> FindByIdAsync(Ulid userId) {
        await Task.Run(() => { });

        return Items.SingleOrDefault(x => x.Id == userId);
    }
}
