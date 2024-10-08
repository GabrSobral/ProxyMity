﻿namespace ProxyMity.Unit.InMemoryRepositories;

internal class InMemoryParticipantRepository(
    IGroupRepository groupRepository,
    IUserRepository userRepository,
    IConversationRepository conversationRepository
) : InMemoryRepository<Participant>, IParticipantRepository {

    public Task AddAsync(Participant participant, CancellationToken cancellationToken) {
        Items.Add(participant);
        return Task.CompletedTask;
    }

    public Task<List<Participant>> GetByConversationIdAsync(Ulid conversationId, CancellationToken cancellationToken) {
        var participants = Items.Where(p => p.ConversationId == conversationId).ToList();
        return Task.FromResult(participants);
    }

    public async Task<Participant?> GetByIdAsync(Ulid userId, Ulid conversationId, CancellationToken cancellationToken) {
        var participant = Items.SingleOrDefault(p => p.UserId == userId && p.ConversationId == conversationId);
        await Task.Run(() => { });

        return participant;
    }

    public Task<List<Participant>> GetByUserIdAsync(Ulid userId, CancellationToken cancellationToken) {
        var participants = Items.Where(p => p.UserId == userId).ToList();

        return Task.FromResult(participants);
    }

    public async Task<List<GetConversationsByUserIdQuery>> GetConversationsByUserIdAsync(Ulid userId, CancellationToken cancellationToken) {
        var participationInConversations = Items.FindAll(p => p.UserId == userId);
        var conversationsWithParticipants = new List<GetConversationsByUserIdQuery>();

        foreach (var item in participationInConversations) {
            Conversation conversation = await conversationRepository.GetByIdAsync(item.ConversationId, cancellationToken)
                ?? throw new ConversationNotFoundException(item.ConversationId);

            Group? group = await groupRepository.FindByIdAsync(conversation?.GroupId ?? Ulid.NewUlid(), cancellationToken);

            conversationsWithParticipants.Add(new GetConversationsByUserIdQuery(
                Id: conversation!.Id,
                CreatedAt: conversation.CreatedAt,
                GroupName: group?.Name,
                GroupDescription: group?.Description,
                GroupId: conversation?.GroupId,
                ConversationPinnedAt: item.ConversationPinnedAt
            ));
        }

        return conversationsWithParticipants;
    }

    public async Task<List<GetParticipantsByConversationIdQuery>> GetParticipantsByConversationIdAsync(Ulid conversationId, CancellationToken cancellationToken) {
        var participantsOfConversation = Items.FindAll(x => x.ConversationId == conversationId);

        var participants = new List<GetParticipantsByConversationIdQuery>();

        foreach (var item in participantsOfConversation) {
            var user = await userRepository.FindByIdAsync(item.UserId, cancellationToken);

            if (user is null) {
                continue;
            }

            var result = new GetParticipantsByConversationIdQuery(
                user.Id,
                user.FirstName,
                user.LastName,
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

    public Task PinConversation(Ulid conversationId, Ulid userId, CancellationToken cancellationToken) {
        foreach (var item in Items) {
            if (item.UserId == userId && item.ConversationId == conversationId) {
                item.ConversationPinnedAt = DateTime.UtcNow;
            }
        }

        return Task.CompletedTask;
    }

    public Task Remove(Participant participant, CancellationToken cancellationToken) {
        Items.Remove(participant);

        return Task.CompletedTask;
    }

    public Task UnpinConversation(Ulid conversationId, Ulid userId, CancellationToken cancellationToken) {
        foreach (var item in Items) {
            if (item.UserId == userId && item.ConversationId == conversationId) {
                item.ConversationPinnedAt = null;
            }
        }

        return Task.CompletedTask;
    }
}
