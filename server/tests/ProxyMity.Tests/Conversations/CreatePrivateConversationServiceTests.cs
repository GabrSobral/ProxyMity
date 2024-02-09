namespace ProxyMity.Unit.Conversations;

public class CreatePrivateConversationServiceTests {
    private readonly ILogger<CreatePrivateConversationCommandHandler> _logger = LoggerFactory.Create(builder => { }).CreateLogger<CreatePrivateConversationCommandHandler>();
    private readonly DataContext _dbContext = new Mock<DataContext>().Object;

    [Fact]
    public async void Handle_Should_CreatesConversationAndParticipants_WhenTheInputIsValid() {
        var inMemoryUserRepository = new InMemoryUserRepository();
        var inMemoryGroupRepository = new InMemoryGroupRepository();
        var inMemoryConversationRepository = new InMemoryConversationRepository();
        var inMemoryParticipantRepository = new InMemoryParticipantRepository(inMemoryGroupRepository, inMemoryUserRepository, inMemoryConversationRepository);

        var createPrivateConversationService = new CreatePrivateConversationCommandHandler(
          _logger,
          inMemoryConversationRepository,
          inMemoryParticipantRepository,
          inMemoryUserRepository,
          _dbContext
        );

        var user1 = User.Create("Test 1", "Test1@email.com", "123");
        var user2 = User.Create("Test 2", "Test2@email.com", "123");

        inMemoryUserRepository.Items.Add(user1);
        inMemoryUserRepository.Items.Add(user2);

        var inputModel = new CreatePrivateConversationCommand(user1.Id, user2.Id);

        var cancellationToken = new CancellationToken();

        await createPrivateConversationService.Handle(inputModel, cancellationToken);

        Assert.Single(inMemoryConversationRepository.Items);
        Assert.Equal(2, inMemoryParticipantRepository.Items.Count);
    }
}