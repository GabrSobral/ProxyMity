namespace ProxyMity.Unit.Conversations;

public class ReadConversationMessagesServiceTest {
    private ILogger<ReadConversationMessagesCommandHandler> _logger;
    private ILogger<SaveMessageCommandHandler> _saveMessageLogger;

    private IUnitOfWork _unitOfWork;

    public ReadConversationMessagesServiceTest() {
        _logger = LoggerFactory.Create(builder => { }).CreateLogger<ReadConversationMessagesCommandHandler>();
        _saveMessageLogger = LoggerFactory.Create(builder => { }).CreateLogger<SaveMessageCommandHandler>();
        _unitOfWork = new UnitOfWorkTest();
    }

    [Fact]
    public async Task Handle_Should_ReadAllPrivateConversationMessages_WhenTheInputIsValid() {
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

        var conversationBetweenJohnAndMichael = Conversation.Create();
        var conversationBetweenAliceAndGeorge = Conversation.Create();

        inMemoryConversationRepository.Items.Add(conversationBetweenJohnAndMichael);
        inMemoryConversationRepository.Items.Add(conversationBetweenAliceAndGeorge);

        var johnsParticipation = Participant.Create(john.Id, conversationBetweenJohnAndMichael.Id);
        var michaelsParticipation = Participant.Create(michael.Id, conversationBetweenJohnAndMichael.Id);

        var alicesParticipation = Participant.Create(alice.Id, conversationBetweenAliceAndGeorge.Id);
        var georgesParticipation = Participant.Create(george.Id, conversationBetweenAliceAndGeorge.Id);

        inMemoryParticipantRepository.Items.Add(johnsParticipation);
        inMemoryParticipantRepository.Items.Add(michaelsParticipation);
        inMemoryParticipantRepository.Items.Add(alicesParticipation);
        inMemoryParticipantRepository.Items.Add(georgesParticipation);

        var johnsMessage1 = Message.Create("John's message 1", conversationBetweenJohnAndMichael.Id, john.Id);
        var johnsMessage2 = Message.Create("John's message 2", conversationBetweenJohnAndMichael.Id, john.Id);
        var johnsMessage3 = Message.Create("John's message 3", conversationBetweenJohnAndMichael.Id, john.Id);
        var johnsMessage4 = Message.Create("John's message 4", conversationBetweenJohnAndMichael.Id, john.Id);
        var michaelsMessage1 = Message.Create("Michael's message 1", conversationBetweenJohnAndMichael.Id, michael.Id);

        var alicesMessage1 = Message.Create("Alice's message 1", conversationBetweenAliceAndGeorge.Id, john.Id);
        var alicesMessage2 = Message.Create("Alice's message 2", conversationBetweenAliceAndGeorge.Id, john.Id);
        var alicesMessage3 = Message.Create("Alice's message 3", conversationBetweenAliceAndGeorge.Id, john.Id);
        var alicesMessage4 = Message.Create("Alice's message 4", conversationBetweenAliceAndGeorge.Id, john.Id);

        inMemoryMessageRepository.Items.Add(johnsMessage1);
        inMemoryMessageRepository.Items.Add(johnsMessage2);
        inMemoryMessageRepository.Items.Add(johnsMessage3);
        inMemoryMessageRepository.Items.Add(johnsMessage4);
        inMemoryMessageRepository.Items.Add(michaelsMessage1);

        inMemoryMessageRepository.Items.Add(alicesMessage1);
        inMemoryMessageRepository.Items.Add(alicesMessage2);
        inMemoryMessageRepository.Items.Add(alicesMessage3);
        inMemoryMessageRepository.Items.Add(alicesMessage4);

        var readConversationMessagesCommand = new ReadConversationMessagesCommand(michael.Id, conversationBetweenJohnAndMichael.Id, false);
        var readConversationMessagesCommandHandler = new ReadConversationMessagesCommandHandler(
            _logger,
            _unitOfWork,
            inMemoryMessageRepository,
            inMemoryConversationRepository,
            inMemoryMessageStatusRepository
        );

        await readConversationMessagesCommandHandler.Handle(readConversationMessagesCommand, new CancellationToken());

        Assert.Equal(9, inMemoryMessageRepository.Items.Count);

        foreach (var item in inMemoryMessageRepository.Items) {
            if (item.AuthorId == michael.Id) { // If is the author of message, don't do anything
                Assert.Null(item.ReadByAllAt);
                continue;
            }

            if (item.ConversationId == conversationBetweenJohnAndMichael.Id)
                Assert.NotNull(item.ReadByAllAt);

            if (item.ConversationId == conversationBetweenAliceAndGeorge.Id)
                Assert.Null(item.ReadByAllAt);
        }
    }

    [Fact]
    public async Task Handle_Should_Not_ReadAllPrivateConversationMessages_WhenTheMessagesAreMine() {
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

        var conversationBetweenJohnAndMichael = Conversation.Create();
        var conversationBetweenAliceAndGeorge = Conversation.Create();

        inMemoryConversationRepository.Items.Add(conversationBetweenJohnAndMichael);
        inMemoryConversationRepository.Items.Add(conversationBetweenAliceAndGeorge);


        inMemoryParticipantRepository.Items.Add(Participant.Create(john.Id, conversationBetweenJohnAndMichael.Id));
        inMemoryParticipantRepository.Items.Add(Participant.Create(michael.Id, conversationBetweenJohnAndMichael.Id));

        inMemoryParticipantRepository.Items.Add(Participant.Create(alice.Id, conversationBetweenAliceAndGeorge.Id));
        inMemoryParticipantRepository.Items.Add(Participant.Create(george.Id, conversationBetweenAliceAndGeorge.Id));


        inMemoryMessageRepository.Items.Add(Message.Create("John's message 1", conversationBetweenJohnAndMichael.Id, john.Id));
        inMemoryMessageRepository.Items.Add(Message.Create("John's message 2", conversationBetweenJohnAndMichael.Id, john.Id));
        inMemoryMessageRepository.Items.Add(Message.Create("John's message 3", conversationBetweenJohnAndMichael.Id, john.Id));
        inMemoryMessageRepository.Items.Add(Message.Create("John's message 4", conversationBetweenJohnAndMichael.Id, john.Id));

        inMemoryMessageRepository.Items.Add(Message.Create("Michael's message 1", conversationBetweenJohnAndMichael.Id, michael.Id));

        inMemoryMessageRepository.Items.Add(Message.Create("Alice's message 1", conversationBetweenAliceAndGeorge.Id, john.Id));
        inMemoryMessageRepository.Items.Add(Message.Create("Alice's message 2", conversationBetweenAliceAndGeorge.Id, john.Id));
        inMemoryMessageRepository.Items.Add(Message.Create("Alice's message 3", conversationBetweenAliceAndGeorge.Id, john.Id));
        inMemoryMessageRepository.Items.Add(Message.Create("Alice's message 4", conversationBetweenAliceAndGeorge.Id, john.Id));

        var readConversationMessagesCommand = new ReadConversationMessagesCommand(john.Id, conversationBetweenJohnAndMichael.Id, false);
        var readConversationMessagesCommandHandler = new ReadConversationMessagesCommandHandler(
            _logger,
            _unitOfWork,
            inMemoryMessageRepository,
            inMemoryConversationRepository,
            inMemoryMessageStatusRepository
        );

        await readConversationMessagesCommandHandler.Handle(readConversationMessagesCommand, new CancellationToken());

        Assert.Equal(9, inMemoryMessageRepository.Items.Count);

        foreach (var item in inMemoryMessageRepository.Items) {
            if (item.ConversationId == conversationBetweenJohnAndMichael.Id &&
                item.AuthorId == john.Id
            ) {
                Assert.Null(item.ReadByAllAt);
                continue;
            }

            if (item.ConversationId == conversationBetweenJohnAndMichael.Id &&
                item.AuthorId == michael.Id
            ) {
                Assert.NotNull(item.ReadByAllAt);
                continue;
            }

            if (item.ConversationId == conversationBetweenAliceAndGeorge.Id)
                Assert.Null(item.ReadByAllAt);
        }
    }

    [Fact]
    public async Task Handle_Should_ReadAllGroupConversationMessages_WhenTheInputIsValid() {
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

        var saveMessageCommandHandler = new SaveMessageCommandHandler(
            _saveMessageLogger,
            inMemoryMessageRepository,
            inMemoryMessageStatusRepository,
            inMemoryParticipantRepository,
            inMemoryConversationRepository,
            _unitOfWork
        );

        CancellationToken cancellationToken = new();

        await saveMessageCommandHandler.Handle(
            new SaveMessageCommand(Message.Create("John's message 1", conversationGroupWithAll.Id, john.Id)),
            cancellationToken);

        await saveMessageCommandHandler.Handle(
            new SaveMessageCommand(Message.Create("John's message 2", conversationGroupWithAll.Id, john.Id)),
            cancellationToken);

        await saveMessageCommandHandler.Handle(
            new SaveMessageCommand(Message.Create("John's message 3", conversationGroupWithAll.Id, john.Id)),
            cancellationToken);

        await saveMessageCommandHandler.Handle(
            new SaveMessageCommand(Message.Create("John's message 4", conversationGroupWithAll.Id, john.Id)),
            cancellationToken);

        await saveMessageCommandHandler.Handle(
             new SaveMessageCommand(Message.Create("Michael's message 1", conversationGroupWithAll.Id, michael.Id)),
             cancellationToken);

        await saveMessageCommandHandler.Handle(
             new SaveMessageCommand(Message.Create("Alice's message 1", conversationGroupWithAll.Id, alice.Id)),
             cancellationToken);

        await saveMessageCommandHandler.Handle(
             new SaveMessageCommand(Message.Create("Alice's message 2", conversationGroupWithAll.Id, alice.Id)),
             cancellationToken);

        await saveMessageCommandHandler.Handle(
             new SaveMessageCommand(Message.Create("Alice's message 3", conversationGroupWithAll.Id, alice.Id)),
             cancellationToken);

        await saveMessageCommandHandler.Handle(
             new SaveMessageCommand(Message.Create("Alice's message 4", conversationGroupWithAll.Id, alice.Id)),
             cancellationToken);

        var readConversationMessagesCommandFromMichael = new ReadConversationMessagesCommand(michael.Id, conversationGroupWithAll.Id, true);
        var readConversationMessagesCommandHandlerFromMichael = new ReadConversationMessagesCommandHandler(
            _logger,
            _unitOfWork,
            inMemoryMessageRepository,
            inMemoryConversationRepository,
            inMemoryMessageStatusRepository
        );

        await readConversationMessagesCommandHandlerFromMichael
            .Handle(readConversationMessagesCommandFromMichael, new CancellationToken());

        Assert.Equal(9, inMemoryMessageRepository.Items.Count);
        Assert.Equal(27, inMemoryMessageStatusRepository.Items.Count);

        var currentUnreadMessages = inMemoryMessageStatusRepository.Items.Where(x => x.ReadAt == null);
        Assert.Equal(19, currentUnreadMessages.Count());

        var readConversationMessagesCommandFromJohn = new ReadConversationMessagesCommand(john.Id, conversationGroupWithAll.Id, true);
        var readConversationMessagesCommandHandlerFromJohn = new ReadConversationMessagesCommandHandler(
            _logger,
            _unitOfWork,
            inMemoryMessageRepository,
            inMemoryConversationRepository,
            inMemoryMessageStatusRepository
        );

        await readConversationMessagesCommandHandlerFromJohn.Handle(
            readConversationMessagesCommandFromJohn, cancellationToken);

        currentUnreadMessages = inMemoryMessageStatusRepository.Items.Where(x => x.ReadAt == null);
        Assert.Equal(14, currentUnreadMessages.Count());

        var readConversationMessagesCommandFromAlice = new ReadConversationMessagesCommand(alice.Id, conversationGroupWithAll.Id, true);
        var readConversationMessagesCommandHandlerFromAlice = new ReadConversationMessagesCommandHandler(
            _logger,
            _unitOfWork,
            inMemoryMessageRepository,
            inMemoryConversationRepository,
            inMemoryMessageStatusRepository
        );

        await readConversationMessagesCommandHandlerFromAlice.Handle(
            readConversationMessagesCommandFromAlice, cancellationToken);

        currentUnreadMessages = inMemoryMessageStatusRepository.Items.Where(x => x.ReadAt == null);
        Assert.Equal(9, currentUnreadMessages.Count());

        var readConversationMessagesCommandFromGeorge = new ReadConversationMessagesCommand(george.Id, conversationGroupWithAll.Id, true);
        var readConversationMessagesCommandHandlerFromGeorge = new ReadConversationMessagesCommandHandler(
            _logger,
            _unitOfWork,
            inMemoryMessageRepository,
            inMemoryConversationRepository,
            inMemoryMessageStatusRepository
        );

        await readConversationMessagesCommandHandlerFromAlice.Handle(
            readConversationMessagesCommandFromGeorge, cancellationToken);

        currentUnreadMessages = inMemoryMessageStatusRepository.Items.Where(x => x.ReadAt == null);
        Assert.Empty(currentUnreadMessages);
    }
}
