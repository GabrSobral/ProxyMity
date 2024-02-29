namespace ProxyMity.Unit.Conversations;

public sealed class UnpinConversationServiceTests {
    private readonly ILogger<UnpinConversationCommandHandler> _logger = LoggerFactory.Create(builder => { }).CreateLogger<UnpinConversationCommandHandler>();

    private readonly DataContext _dbContext = new Mock<DataContext>().Object;

    [Fact]
    public async Task Handle_Should_UnpinConversation_WhenInputIsValid() {
        var inMemoryConversationRepository = new InMemoryConversationRepository();
        var inMemoryGroupRepository = new InMemoryGroupRepository();
        var inMemoryUserRepository = new InMemoryUserRepository();
        var inMemoryParticipantRepository = new InMemoryParticipantRepository(
            inMemoryGroupRepository,
            inMemoryUserRepository,
            inMemoryConversationRepository);

        var john = User.Create("John", "john@email.com", "123");
        var michael = User.Create("Michael", "michael@email.com", "123");

        inMemoryUserRepository.Items.Add(john);
        inMemoryUserRepository.Items.Add(michael);

        var conversationBetweenJohnAndMichael = Conversation.Create();

        inMemoryConversationRepository.Items.Add(conversationBetweenJohnAndMichael);

        var johnParticipation = Participant.Create(john.Id, conversationBetweenJohnAndMichael.Id);
        var michaelParticipation = Participant.Create(michael.Id, conversationBetweenJohnAndMichael.Id);

        johnParticipation.ConversationPinnedAt = DateTime.UtcNow;

        inMemoryParticipantRepository.Items = [johnParticipation, michaelParticipation];

        var commandHandler = new UnpinConversationCommandHandler(_logger, inMemoryParticipantRepository, _dbContext);
        var command = new UnpinConversationCommand(conversationBetweenJohnAndMichael.Id, john.Id);

        var targetParticipation = inMemoryParticipantRepository.Items
            .FirstOrDefault(x => x.UserId == command.UserId && x.ConversationId == command.ConversationId);

        Assert.NotNull(targetParticipation?.ConversationPinnedAt);

        await commandHandler.Handle(command, new CancellationToken());

        targetParticipation = inMemoryParticipantRepository.Items
            .FirstOrDefault(x => x.UserId == command.UserId && x.ConversationId == command.ConversationId);

        Assert.Null(targetParticipation?.ConversationPinnedAt);
    }
}
