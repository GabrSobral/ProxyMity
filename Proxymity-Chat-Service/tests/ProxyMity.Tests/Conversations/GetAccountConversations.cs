using ProxyMity.Application.Handlers.Conversations.Queries.GetUserConversations;

namespace ProxyMity.Unit.Conversations; 

public sealed class GetAccountConversations {
    private readonly ILogger<GetUserConversationsQueryHandler> _logger = LoggerFactory.Create(builder => { }).CreateLogger<GetUserConversationsQueryHandler>();
    private readonly DataContext _dbContext = new Mock<DataContext>().Object;

    [Fact]
    public async Task Handler_Should_GetAllUserConversations_WhenInputIsValid() {
        var inMemoryMessageRepository = new InMemoryMessageRepository();
        var inMemoryGroupRepository = new InMemoryGroupRepository();
        var inMemoryUserRepository = new InMemoryUserRepository();
        var inMemoryConversationRepository = new InMemoryConversationRepository();

        var inMemoryParticipantRepository = new InMemoryParticipantRepository(inMemoryGroupRepository, inMemoryUserRepository, inMemoryConversationRepository);
        var inMemoryMessageStatusRepository = new InMemoryMessageStatusRepository();

        var john = User.Create("John", "john@email.com", "123");
        var michael = User.Create("michael", "michael@email.com", "123");
        var elisa = User.Create("Elisa", "elisa@email.com", "123");

        inMemoryUserRepository.Items = [john, michael, elisa];

        var chatWithJohnAndMichael = Conversation.Create();
        inMemoryConversationRepository.Items.Add(chatWithJohnAndMichael);

        inMemoryParticipantRepository.Items = [
            Participant.Create(john.Id, chatWithJohnAndMichael.Id),  
            Participant.Create(michael.Id, chatWithJohnAndMichael.Id),
        ];

        var getUserConversationsQuery = new GetUserConversationsQuery(john.Id);

        var getUserConversationsQueryHandler = new GetUserConversationsQueryHandler(
            _logger,
            inMemoryMessageRepository,
            inMemoryParticipantRepository,
            inMemoryMessageStatusRepository
        );

        var conversations = await getUserConversationsQueryHandler.Handle(getUserConversationsQuery, new CancellationToken());

        Assert.NotEmpty( conversations );
    }
}
