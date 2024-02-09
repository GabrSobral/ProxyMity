namespace ProxyMity.Unit.Friendships;

public class DenyFriendshipInviteServiceTests {
    private readonly ILogger<DenyFriendshipInviteCommandHandler> _logger = LoggerFactory.Create(builder => { }).CreateLogger<DenyFriendshipInviteCommandHandler>();
    private readonly DataContext _dbContext = new Mock<DataContext>().Object;

    /// <summary>
    /// 
    /// </summary>
    [Fact]
    public async Task Handle_Should_DenyAFriendshipInvite_WhenTheInputIsValid() {
        var inMemoryFriendshipRepository = new InMemoryFriendshipRepository();
        
        var john = User.Create("John", "john@email.com", "123");
        var michael = User.Create("Michael", "michael@email.com", "123");

        var friendship = Friendship.Create(requesterId: john.Id, targetId: michael.Id);
        inMemoryFriendshipRepository.Items.Add(friendship);
        
        var command = new DenyFriendshipInviteCommand(michael.Id, john.Id);
        var commandHandler = new DenyFriendshipInviteCommandHandler(_logger, inMemoryFriendshipRepository, _dbContext);

        Assert.Null(friendship.DeniedAt);
        
        await commandHandler.Handle(command, new CancellationToken());

        Assert.NotNull(friendship.DeniedAt);
    }
    
    /// <summary>
    /// 
    /// </summary>
    [Fact]
    public async Task Validator_Should_ThrowAnError_WhenTheRequesterIdIsTheSameAsTargetId() {
        var john = User.Create("John", "john@email.com", "123");
        
        var command = new DenyFriendshipInviteCommand(john.Id, john.Id);
        var validator = new DenyFriendshipInviteCommandValidator();

        await Assert.ThrowsAsync<ValidationException>(async () => {
            await validator.ValidateAndThrowAsync(command);
        });
    }
}