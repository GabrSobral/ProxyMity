namespace ProxyMity.Application.Services;

public class AuthenticateService
{
    private readonly IPasswordEncrypter _passwordEncrypter;
    private readonly ILogger<AuthenticateService> _logger;
    private readonly IJsonWebToken _jsonWebToken;
    private readonly DataContext _dbContext;
    private readonly IMapper _mapper;

    public AuthenticateService(IPasswordEncrypter passwordEncrypter, ILogger<AuthenticateService> logger, DataContext dbContext, IJsonWebToken jsonWebToken, IMapper mapper)
    {
        _passwordEncrypter = passwordEncrypter;
        _logger = logger;
        _dbContext = dbContext;
        _jsonWebToken = jsonWebToken;
        _mapper = mapper;
    }

    public async Task<AuthenticateViewModel> SignInAsync(SignInInputModel model)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(user => user.Email == model.Email)
            ?? throw new EmailOrPasswordInvalidException();

        var isPasswordCorrect = _passwordEncrypter.Compare(user.Password, model.Password, user.Id);

        if (!isPasswordCorrect)
            throw new EmailOrPasswordInvalidException();

        _logger.LogInformation($"An user was logged at application: {user.Email}");

        return AssignViewModel(user);
    }

    public async Task<AuthenticateViewModel> SignUpAsync(SignUpInputModel model)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(user => user.Email == model.Email);

        if (user != null)
            throw new UserAlreadyExistException(model.Email);

        var userId = Guid.NewGuid();
        var encryptedPassword = _passwordEncrypter.Encrypt(model.Password, userId);

        User newUser = new()
        {
            Id = userId,
            Name = model.Name,
            Email = model.Email,
            Password = encryptedPassword,
            CreatedAt = DateTime.UtcNow,
            LastOnline = null
        };

        await _dbContext.Users.AddAsync(newUser);
        await _dbContext.SaveChangesAsync();

        _logger.LogInformation($"An user was created at application: {newUser.Email}");

        return AssignViewModel(newUser);
    }

    private AuthenticateViewModel AssignViewModel(User user)
    {
        var viewModel = _mapper.Map<AuthenticateViewModel>(user);
        viewModel.Token = _jsonWebToken.Sign(user);

        return viewModel;
    }
}
