﻿namespace ProxyMity.Infra.Database.Repositories;

public sealed class ParticipantRepository(DataContext dbContext) : IParticipantRepository
{
    public async Task AddAsync(Participant participant, CancellationToken cancellationToken)
    {
        await dbContext.Participants.AddAsync(participant, cancellationToken);
    }

    public async Task<List<Participant>> GetByConversationIdAsync(Ulid conversationId, CancellationToken cancellationToken)
        => await dbContext.Participants
            .AsNoTracking()
            .Where(x => x.ConversationId == conversationId)
            .ToListAsync(cancellationToken);

    public async Task<Participant?> GetByIdAsync(Ulid userId, Ulid conversationId, CancellationToken cancellationToken)
        => await dbContext.Participants
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.UserId == userId && x.ConversationId == conversationId, cancellationToken: cancellationToken);

    public async Task<List<Participant>> GetByUserIdAsync(Ulid userId, CancellationToken cancellationToken)
        => await dbContext.Participants
            .AsNoTracking()
            .Where(x => x.UserId == userId)
            .ToListAsync(cancellationToken);

    public async Task<List<GetConversationsByUserIdQuery>> GetConversationsByUserIdAsync(Ulid userId, CancellationToken cancellationToken)
        => await dbContext.Participants
            .AsNoTracking()
            .Include(x => x.Conversation)
                .ThenInclude(x => x.Group)
            .Where(x => x.UserId == userId)
            .Select(x => new GetConversationsByUserIdQuery(
                x.ConversationId,
                x.CreatedAt,
                x.Conversation.Group.Name,
                x.Conversation.Group.Description,
                x.Conversation.GroupId,
                x.ConversationPinnedAt
            ))
            .ToListAsync(cancellationToken);

    public async Task<List<GetParticipantsByConversationIdQuery>> GetParticipantsByConversationIdAsync(Ulid conversationId, CancellationToken cancellationToken)
        => await dbContext.Participants
            .AsNoTracking()
            .Include(x => x.User)
            .Where(x => x.ConversationId == conversationId)
            .Select(x => new GetParticipantsByConversationIdQuery(
                x.UserId,
                x.User.FirstName,
                x.User.LastName,
                x.User.Email,
                x.User.PhotoUrl,
                x.User.LastOnline,
                x.CreatedAt,
                x.RemovedAt
            ))
            .ToListAsync(cancellationToken);

    public async Task PinConversation(Ulid conversationId, Ulid userId, CancellationToken cancellationToken)
    {
        await dbContext.Participants
            .Where(x => x.UserId == userId && x.ConversationId == conversationId)
            .ExecuteUpdateAsync(x => x.SetProperty(instance => instance.ConversationPinnedAt, DateTime.UtcNow), cancellationToken: cancellationToken);
    }

    public Task Remove(Participant participant, CancellationToken cancellationToken)
    {
        dbContext.Participants.Remove(participant);

        return Task.CompletedTask;
    }

    public async Task UnpinConversation(Ulid conversationId, Ulid userId, CancellationToken cancellationToken)
    {
        await dbContext.Participants
            .Where(x => x.UserId == userId && x.ConversationId == conversationId)
            .ExecuteUpdateAsync(x => x.SetProperty(instance => instance.ConversationPinnedAt, (DateTime?)null), cancellationToken);
    }
}
