namespace ProxyMity.Application.Services;

public class GroupService
{
    private readonly IMapper _mapper;
    private readonly DataContext _dbContext;
    private readonly ILogger<GroupService> _logger;

    public GroupService(IMapper mapper, DataContext dbContext, ILogger<GroupService> logger)
    {
        _mapper = mapper;
        _dbContext = dbContext;
        _logger = logger;
    }

    public async Task CreateGroupAsync(CreateGroupInputModel model)
    {
        Group group = new()
        {
            Id = Guid.NewGuid(),
            Name = model.Name,
            Description = model.Description
        };

        Conversation conversation = new()
        {
            Id = Guid.NewGuid(),
            GroupId = group.Id,
            CreatedAt = DateTime.UtcNow,
        };

        await _dbContext.Groups.AddAsync(group);
        await _dbContext.Conversations.AddAsync(conversation);

        Task[] tasks = new Task[model.Participants.Count];

        for (int i = 0; i < model.Participants.Count; i++)
        {
            tasks[i] = Task.Run(async () =>
            {
                var participant = new Participant
                {
                    ConversationId = conversation.Id,
                    CreatedAt = DateTime.UtcNow,
                    UserId = model.Participants[i],
                };

                await _dbContext.Participants.AddAsync(participant);
            });
        }

        await Task.WhenAll(tasks);
    }
}
