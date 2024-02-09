namespace ProxyMity.Unit.Friendships;

public class AcceptFriendshipInviteServiceTests {
    private readonly ILogger<AcceptFriendshipInviteCommandHandler> _logger = LoggerFactory.Create(builder => { }).CreateLogger<AcceptFriendshipInviteCommandHandler>();
    private readonly DataContext _dbContext = new Mock<DataContext>().Object;

    /// <summary>
    /// 
    /// </summary>
    [Fact]
    public async Task Handle_Should_AcceptAFriendshipInvite_WhenTheInputIsValid() {
        var inMemoryFriendshipRepository = new InMemoryFriendshipRepository();
        
        var john = User.Create("John", "john@email.com", "123");
        var michael = User.Create("Michael", "michael@email.com", "123");

        var friendship = Friendship.Create(requesterId: john.Id, targetId: michael.Id);
        inMemoryFriendshipRepository.Items.Add(friendship);
        
        var command = new AcceptFriendshipInviteCommand(michael.Id, john.Id);
        var commandHandler = new AcceptFriendshipInviteCommandHandler(_logger, inMemoryFriendshipRepository, _dbContext);

        Assert.Null(friendship.AcceptedAt);
        
        await commandHandler.Handle(command, new CancellationToken());

        Assert.NotNull(friendship.AcceptedAt);
    }
    
    /// <summary>
    /// 
    /// </summary>
    [Fact]
    public async Task Validator_Should_ThrowAnError_WhenTheRequesterIdIsTheSameAsTargetId() {
        var john = User.Create("John", "john@email.com", "123");
        
        var command = new AcceptFriendshipInviteCommand(john.Id, john.Id);
        var validator = new AcceptFriendshipInviteCommandValidator();

        await Assert.ThrowsAsync<ValidationException>(async () => {
            await validator.ValidateAndThrowAsync(command);
        });
    }
}