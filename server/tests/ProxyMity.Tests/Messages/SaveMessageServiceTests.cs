namespace ProxyMity.Unit.Messages;

public class SaveMessageServiceTests {
    private readonly ILogger<SaveMessageCommandHandler> _logger;
    private readonly IUnitOfWork _unitOfWork;

    public SaveMessageServiceTests() {
        _logger = LoggerFactory.Create(builder => { }).CreateLogger<SaveMessageCommandHandler>();
        _unitOfWork = new UnitOfWorkTest();
    }

    [Fact]
    public async Task Handle_Should_SaveMessageInPrivateConversation_WhenTheInputIsValid() {
        var inMemoryUserRepository = new InMemoryUserRepository();
        var inMemoryGroupRepository = new InMemoryGroupRepository();
        var inMemoryMessageRepository = new InMemoryMessageRepository();
        var inMemoryMessageStatusRepository = new InMemoryMessageStatusRepository();
        var inMemoryConversationRepository = new InMemoryConversationRepository();
        var inMemoryParticipantRepository = new InMemoryParticipantRepository(
            inMemoryGroupRepository,
            inMemoryUserRepository,
            inMemoryConversationRepository
        );

        var john = User.Create("John", "John@email.com", "123");
        var michael = User.Create("Michael", "Michael@email.com", "123");

        var privateConversation = Conversation.Create();

        inMemoryUserRepository.Items.Add(john);
        inMemoryUserRepository.Items.Add(michael);

        inMemoryConversationRepository.Items.Add(privateConversation);

        inMemoryParticipantRepository.Items.Add(Participant.Create(john.Id, privateConversation.Id));
        inMemoryParticipantRepository.Items.Add(Participant.Create(michael.Id, privateConversation.Id));

        var johnsMessage1 = Message.Create("John's message 1", privateConversation.Id, john.Id);

        var saveMessageCommand = new SaveMessageCommand(johnsMessage1);
        var saveMessageCommandHandler = new SaveMessageCommandHandler(
            _logger,
            inMemoryMessageRepository,
            inMemoryMessageStatusRepository,
            inMemoryParticipantRepository,
            inMemoryConversationRepository,
            _unitOfWork
        );

        await saveMessageCommandHandler.Handle(saveMessageCommand, new CancellationToken());

        Assert.Single(inMemoryMessageRepository.Items);
        Assert.Empty(inMemoryMessageStatusRepository.Items);
    }

    [Fact]
    public async Task Handle_Should_SaveMessageInGroupConversation_WhenTheInputIsValid() {
        var inMemoryUserRepository = new InMemoryUserRepository();
        var inMemoryGroupRepository = new InMemoryGroupRepository();
        var inMemoryMessageRepository = new InMemoryMessageRepository();
        var inMemoryMessageStatusRepository = new InMemoryMessageStatusRepository();
        var inMemoryConversationRepository = new InMemoryConversationRepository();
        var inMemoryParticipantRepository = new InMemoryParticipantRepository(
            inMemoryGroupRepository,
            inMemoryUserRepository,
            inMemoryConversationRepository
        );

        var john = User.Create("John", "John@email.com", "123");
        var michael = User.Create("Michael", "Michael@email.com", "123");
        var alice = User.Create("Alice", "Alice@email.com", "123");
        var george = User.Create("George", "George@email.com", "123");

        inMemoryUserRepository.Items.Add(john);
        inMemoryUserRepository.Items.Add(michael);
        inMemoryUserRepository.Items.Add(alice);
        inMemoryUserRepository.Items.Add(george);

        var group = Group.Create(john.Id, "Group Name", "Group Description");
        var conversationGroupWithAll = Conversation.Create(group.Id);

        inMemoryConversationRepository.Items.Add(conversationGroupWithAll);

        inMemoryParticipantRepository.Items.Add(Participant.Create(john.Id, conversationGroupWithAll.Id));
        inMemoryParticipantRepository.Items.Add(Participant.Create(michael.Id, conversationGroupWithAll.Id));
        inMemoryParticipantRepository.Items.Add(Participant.Create(alice.Id, conversationGroupWithAll.Id));
        inMemoryParticipantRepository.Items.Add(Participant.Create(george.Id, conversationGroupWithAll.Id));

        var johnsMessage1 = Message.Create("John's message 1", conversationGroupWithAll.Id, john.Id);

        var saveMessageCommand = new SaveMessageCommand(johnsMessage1);
        var saveMessageCommandHandler = new SaveMessageCommandHandler(
            _logger,
            inMemoryMessageRepository,
            inMemoryMessageStatusRepository,
            inMemoryParticipantRepository,
            inMemoryConversationRepository,
            _unitOfWork
        );

        await saveMessageCommandHandler.Handle(saveMessageCommand, new CancellationToken());

        Assert.Single(inMemoryMessageRepository.Items);
        Assert.Equal(3, inMemoryMessageStatusRepository.Items.Count);
    }
}
