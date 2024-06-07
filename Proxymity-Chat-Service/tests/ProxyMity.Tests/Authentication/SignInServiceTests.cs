namespace ProxyMity.Unit.Authentication;

public class SignInServiceTests {
    private ILogger<SignInCommandHandler> _logger { get; set; }
    private IPasswordEncrypter _passwordEncrypter { get; set; }
    private IJsonWebToken _jsonWebToken { get; set; }

    public SignInServiceTests() {
        _logger = LoggerFactory.Create(builder => { }).CreateLogger<SignInCommandHandler>();

        IOptions<JwtOptions> jwtOptions = new TestOptions<JwtOptions>(new JwtOptions {
            Audience = "ProxyMity Test",
            Issuer = "ProxyMity Test",
            SecretKey = "ema123msad9!dasd%sd!dasd123ddaw123!#5%^Tdas9)",
        });

        _passwordEncrypter = new PasswordEncrypter();

        _jsonWebToken = new JsonWebToken(LoggerFactory.Create(builder => { }).CreateLogger<JsonWebToken>(), jwtOptions);
    }

    [Fact]
    public async void Handle_Should_VerifyUserValidityAndReturnUserData_WhenTheInputIsValid() {
        var inMemoryUserRepository = new InMemoryUserRepository();
        var user = User.Create("Test", "test@email.com", "123");

        user.Password = _passwordEncrypter.Encrypt(user.Password, user.Id);

        inMemoryUserRepository.Items.Add(user);

        var inputModel = new SignInCommand(user.Email, "123");
        var cancellationTokenSource = new CancellationToken();

        var signInService = new SignInCommandHandler(_logger, _jsonWebToken, inMemoryUserRepository, _passwordEncrypter);
        var result = await signInService.Handle(inputModel, cancellationTokenSource);

        Assert.NotNull(result);
        Assert.NotNull(result.AccessToken);
    }

    [Fact]
    public async void Handle_Should_ThrowAnErrorOfUserInvalidData_WhenTheEmailInputIsInvalid() {
        var inMemoryUserRepository = new InMemoryUserRepository();
        var user = User.Create("Test", "test@email.com", "123");

        user.Password = _passwordEncrypter.Encrypt(user.Password, user.Id);

        inMemoryUserRepository.Items.Add(user);

        var inputModel = new SignInCommand("invalid@email.com", "123");
        var signInService = new SignInCommandHandler(_logger, _jsonWebToken, inMemoryUserRepository, _passwordEncrypter);

        var cancellationTokenSource = new CancellationToken();

        await Assert.ThrowsAsync<EmailOrPasswordInvalidException>(async () => {
            await signInService.Handle(inputModel, cancellationTokenSource);
        });
    }

    [Fact]
    public async void ExecuteAsync_InvalidPasswordInput_ThrowAnErrorOfUserInvalidData() {
        var inMemoryUserRepository = new InMemoryUserRepository();
        var user = User.Create("Test", "test@email.com", "123");

        user.Password = _passwordEncrypter.Encrypt(user.Password, user.Id);

        inMemoryUserRepository.Items.Add(user);

        var inputModel = new SignInCommand(user.Email, "1234");
        var signInService = new SignInCommandHandler(_logger, _jsonWebToken, inMemoryUserRepository, _passwordEncrypter);

        var cancellationTokenSource = new CancellationToken();

        await Assert.ThrowsAsync<EmailOrPasswordInvalidException>(async () => {
            await signInService.Handle(inputModel, cancellationTokenSource);
        });
    }
}
