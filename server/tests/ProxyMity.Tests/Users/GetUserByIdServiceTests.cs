namespace ProxyMity.Unit.Users;

public class GetUserByIdServiceTests {
    private readonly ILogger<GetByIdQueryHandler> _logger;

    public GetUserByIdServiceTests() {
        _logger = LoggerFactory.Create(builder => { }).CreateLogger<GetByIdQueryHandler>();
    }

    [Fact]
    public async Task Handle_Should_GetUserById_WhenTheInputIsValid() {
        var inMemoryUserRepository = new InMemoryUserRepository();

        var john = User.Create("John", "john@email.com", "123");

        inMemoryUserRepository.Items.Add(john);

        var command = new GetByIdQuery(john.Id);
        var getByIdCommandHandler = new GetByIdQueryHandler(_logger, inMemoryUserRepository);

        var result = await getByIdCommandHandler.Handle(command, new CancellationToken());

        Assert.NotNull(result);
    }

    [Fact]
    public async Task Handle_Should_Not_GetUserById_WhenTheInputIsInvalid() {
        var inMemoryUserRepository = new InMemoryUserRepository();

        var john = User.Create("John", "john@email.com", "123");

        inMemoryUserRepository.Items.Add(john);

        var command = new GetByIdQuery(Ulid.NewUlid());
        var getByIdCommandHandler = new GetByIdQueryHandler(_logger, inMemoryUserRepository);

        await Assert.ThrowsAsync<UserNotFoundException>(async () => {
            await getByIdCommandHandler.Handle(command, new CancellationToken());
        });
    }
}
