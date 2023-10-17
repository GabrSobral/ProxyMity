namespace ProxyMity.Unit.Users;

public class GetUserByEmailServiceTests {
    private readonly ILogger<GetByEmailQueryHandler> _logger;

    public GetUserByEmailServiceTests() {
        _logger = LoggerFactory.Create(builder => { }).CreateLogger<GetByEmailQueryHandler>();
    }

    [Fact]
    public async Task Handle_Should_GetUserById_WhenTheInputIsValid() {
        var inMemoryUserRepository = new InMemoryUserRepository();

        var john = User.Create("John", "john@email.com", "123");

        inMemoryUserRepository.Items.Add(john);

        var command = new GetByEmailQuery(john.Email);
        var getByIdCommandHandler = new GetByEmailQueryHandler(_logger, inMemoryUserRepository);

        var result = await getByIdCommandHandler.Handle(command, new CancellationToken());

        Assert.NotNull(result);
    }

    [Fact]
    public async Task Handle_Should_Not_GetUserById_WhenTheInputIsInvalid() {
        var inMemoryUserRepository = new InMemoryUserRepository();

        var john = User.Create("John", "john@email.com", "123");

        inMemoryUserRepository.Items.Add(john);

        var command = new GetByEmailQuery("invalid@email.com");
        var getByIdCommandHandler = new GetByEmailQueryHandler(_logger, inMemoryUserRepository);

        await Assert.ThrowsAsync<UserNotFoundException>(async () => {
            await getByIdCommandHandler.Handle(command, new CancellationToken());
        });
    }
}
