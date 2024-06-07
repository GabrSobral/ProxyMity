namespace ProxyMity.Unit.Friendships;

public class CreateFriendshipInviteServiceTests {
    private readonly ILogger<CreateFriendshipInviteCommandHandler> _logger = LoggerFactory.Create(builder => { }).CreateLogger<CreateFriendshipInviteCommandHandler>();
    private readonly DataContext _dbContext = new Mock<DataContext>().Object;

    [Fact]
    public async Task Handle_Should_CreateAnInviteToAnotherUser_WhenTheInputIsValid() {
        var inMemoryFriendshipRepository = new InMemoryFriendshipRepository();

        var john = User.Create("John", "john@email.com", "123");
        var michael = User.Create("Michael", "michael@email.com", "123");

        var validator = new CreateFriendshipInviteCommandValidator();
        var commandHandler = new CreateFriendshipInviteCommandHandler(_logger, inMemoryFriendshipRepository, _dbContext);
        var command = new CreateFriendshipInviteCommand(john.Id, michael.Id);

        await validator.ValidateAndThrowAsync(command);

        await commandHandler.Handle(command, new CancellationToken());
    }
    
    [Fact]
    public async Task Validator_Should_ThrowAnError_WhenTheRequesterIdIsTheSameAsTargetId() {
        var michael = User.Create("Michael", "michael@email.com", "123");

        var validator = new CreateFriendshipInviteCommandValidator();
        var command = new CreateFriendshipInviteCommand(michael.Id, michael.Id);

        await  Assert.ThrowsAsync<ValidationException>(async () => {
            await validator.ValidateAndThrowAsync(command);
        });
    }
}