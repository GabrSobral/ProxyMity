namespace ProxyMity.Domain.Interfaces.Repositories.UserRepository;

public interface IUserRepository
{
    public Task CreateAsync(User newUser, CancellationToken cancellationToken);
    public Task<User?> FindByIdAsync(Ulid userId, CancellationToken cancellationToken);
    public Task<User?> FindByEmailAsync(string email, CancellationToken cancellationToken);
}
