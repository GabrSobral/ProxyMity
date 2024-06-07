namespace ProxyMity.Infra.Database.Repositories;

public sealed class UserRepository(DataContext dbContext) : IUserRepository
{
    public async Task CreateAsync(User newUser, CancellationToken cancellationToken)
        => await dbContext.Users.AddAsync(newUser, cancellationToken);

    public async Task<User?> FindByEmailAsync(string email, CancellationToken cancellationToken)
        => await dbContext.Users
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Email == email, cancellationToken: cancellationToken);

    public async Task<User?> FindByIdAsync(Ulid userId, CancellationToken cancellationToken)
        => await dbContext.Users
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == userId, cancellationToken: cancellationToken);
}
