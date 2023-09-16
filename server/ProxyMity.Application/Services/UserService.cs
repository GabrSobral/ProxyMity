namespace ProxyMity.Application.Services;

public class UserService
{
    private readonly ILogger<UserService> _logger;
    private readonly DataContext _dbContext;
    private readonly IMapper _mapper;

    public UserService(ILogger<UserService> logger, DataContext dbContext, IMapper mapper)
    {
        _logger = logger;
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<UserViewModel> GetByIdAsync(Guid userId)
    {
        _logger.LogInformation($"Searching for user ID: {userId}");

        var user = await _dbContext.Users.FirstOrDefaultAsync(user => user.Id == userId)
            ?? throw new UserNotFoundException(userId);

        return _mapper.Map<UserViewModel>(user);
    }

    public async Task<UserViewModel> GetByEmailAsync(string email)
    {
        _logger.LogInformation($"Searching for user e-mail: {email}");

        var user = await _dbContext.Users.FirstOrDefaultAsync(user => user.Email == email)
            ?? throw new UserNotFoundException(email);

        return _mapper.Map<UserViewModel>(user);
    }
}
