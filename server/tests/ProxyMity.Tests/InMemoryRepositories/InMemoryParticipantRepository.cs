namespace ProxyMity.Unit.InMemoryRepositories;

internal class InMemoryParticipantRepository : InMemoryRepository<Participant>, IParticipantRepository {
    private IGroupRepository _groupRepository { get; set; }
    private IUserRepository _userRepository { get; set; }
    private IConversationRepository _conversationRepository { get; set; }

    public InMemoryParticipantRepository(IGroupRepository groupRepository, IUserRepository userRepository, IConversationRepository conversationRepository) {
        _groupRepository = groupRepository;
        _userRepository = userRepository;
        _conversationRepository = conversationRepository;
    }

    public Task AddAsync(Participant participant) {
        Items.Add(participant);
        return Task.CompletedTask;
    }

    public Task<IEnumerable<Participant>> GetByConversationIdAsync(Ulid conversationId) {
        var participants = Items.Where(p => p.ConversationId == conversationId);
        return Task.FromResult(participants);
    }

    public async Task<Participant?> GetByIdAsync(Ulid userId, Ulid conversationId) {
        var participant = Items.SingleOrDefault(p => p.UserId == userId && p.ConversationId == conversationId);
        await Task.Run(() => { });

        return participant;
    }

    public Task<IEnumerable<Participant>> GetByUserIdAsync(Ulid userId) {
        var participants = Items.Where(p => p.UserId == userId);

        return Task.FromResult(participants);
    }

    public async Task<IEnumerable<GetConversationsByUserIdQuery>> GetConversationsByUserIdAsync(Ulid userId) {
        var participationInConversations = Items.FindAll(p => p.UserId == userId);
        var conversationsWithParticipants = new List<GetConversationsByUserIdQuery>();

        foreach (var item in participationInConversations) {
            var conversation = await _conversationRepository.GetByIdAsync(item.UserId)
                ?? throw new Exception("Conversation not found");

            var group = await _groupRepository.FindByIdAsync(item.UserId)
                ?? throw new Exception("Conversation not found");

            conversationsWithParticipants.Add(new GetConversationsByUserIdQuery(
                conversation.Id,
                conversation.CreatedAt,
                group.Description,
                group.Name,
                group.Id
            ));
        }

        return conversationsWithParticipants;
    }

    public async Task<IEnumerable<GetParticipantsByConversationIdQuery>> GetParticipantsByConversationIdAsync(Ulid conversationId) {
        var participantsOfConversation = Items.FindAll(x => x.ConversationId == conversationId);

        var participants = new List<GetParticipantsByConversationIdQuery>();

        foreach (var item in participantsOfConversation) {
            var user = await _userRepository.FindByIdAsync(item.UserId);

            if (user is null) {
                continue;
            }

            var result = new GetParticipantsByConversationIdQuery(
                user.Id,
                user.Name,
                user.Email,
                user.PhotoUrl,
                user.LastOnline,
                item.CreatedAt,
                item.RemovedAt
            );

            participants.Add(result);
        }

        return participants;
    }

    public Task RemoveAsync(Participant participant) {
        Items.Remove(participant);

        return Task.CompletedTask;
    }
}
