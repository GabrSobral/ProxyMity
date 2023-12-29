namespace ProxyMity.Domain.Interfaces.Repositories.UserRepository;

public interface IUserRepository
{
    public Task CreateAsync(User newUser);
    public Task<User?> FindByIdAsync(Ulid userId);
    public Task<User?> FindByEmailAsync(string email);
}
