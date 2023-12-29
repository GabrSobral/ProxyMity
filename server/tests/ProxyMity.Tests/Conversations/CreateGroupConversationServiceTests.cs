namespace ProxyMity.Unit.Conversations;

public class CreateGroupConversationServiceTests {
    private readonly ILogger<CreateGroupConversationCommandHandler> _logger;
    private readonly IUnitOfWork _unitOfWork;

    public CreateGroupConversationServiceTests() {
        _logger = LoggerFactory.Create(builder => { }).CreateLogger<CreateGroupConversationCommandHandler>();
        _unitOfWork = new UnitOfWorkTest();
    }

    private CreateGroupConversationCommandHandler CreateInstanceAndAddUsers(IEnumerable<User> users) {
        var inMemoryUserRepository = new InMemoryUserRepository();
        var inMemoryGroupRepository = new InMemoryGroupRepository();
        var inMemoryConversationRepository = new InMemoryConversationRepository();
        var inMemoryParticipantRepository = new InMemoryParticipantRepository(inMemoryGroupRepository, inMemoryUserRepository, inMemoryConversationRepository);

        foreach (var item in users) {
            inMemoryUserRepository.Items.Add(item);
        }

        return new CreateGroupConversationCommandHandler(
          _logger,
          inMemoryGroupRepository,
          inMemoryParticipantRepository,
          inMemoryConversationRepository,
          inMemoryUserRepository,
          _unitOfWork
        );
    }

    [Fact]
    public void Handle_Should_ThrowAnError_WhenParticipantsIsOnlyOne() {
        var user1 = User.Create("Test 1", "Test1@email.com", "123");
        var user2 = User.Create("Test 2", "Test2@email.com", "123");

        var inputModel = new CreateGroupConversationCommand(
            Name: "Test Group",
            Description: "Test Description",
            CreatorId: user1.Id,
            Participants: new[] { user2.Id }
        );

        var validator = new CreateGroupConversationCommandValidator();

        Assert.Throws<FluentValidation.ValidationException>(() => {
            validator.ValidateAndThrow(inputModel);
        });
    }

    [Fact]
    public void Handle_LessThanTwoParticipants_ThrowAnErrorShowingThatAConversationCannotBeCreatedWithMoreThanThreeUsers() {
        var inputModel = new CreateGroupConversationCommand(
            Name: "",
            Description: "Test Description",
            CreatorId: Ulid.NewUlid(),
            Participants: new List<Ulid>()
        );

        var validator = new CreateGroupConversationCommandValidator();

        Assert.Throws<FluentValidation.ValidationException>(() => {
            validator.ValidateAndThrow(inputModel);
        });
    }
}
