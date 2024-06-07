namespace ProxyMity.Infra.Database.Repositories;

public sealed class MessageStatusRepository(DataContext dbContext) : IMessageStatusRepository
{
    public async Task CreateAsync(MessageStatus messageStatus, CancellationToken cancellationToken)
        => await dbContext.MessageStatuses.AddAsync(messageStatus, cancellationToken);

    public async Task<List<MessageStatus>> GetMessagesStatusByMessageIdAsync(Ulid messageId, Ulid conversationId, CancellationToken cancellationToken)
        => await dbContext.MessageStatuses
            .AsNoTracking()
            .Where(x => x.MessageId == messageId && x.ConversationId == conversationId)
            .ToListAsync(cancellationToken);

    public async Task<int> GetUnreadMessagesStatusCountByUserIdAsync(Ulid userId, Ulid conversationId, CancellationToken cancellationToken)
        => await dbContext.MessageStatuses
            .AsNoTracking()
            .Where(x => x.UserId == userId && x.ConversationId == conversationId && x.ReadAt == null)
            .CountAsync(cancellationToken);

    public async Task<IEnumerable<MessageStatus>> GetUnreadMessagesStatusFromConversationByIdAsync(Ulid conversationId, CancellationToken cancellationToken)
        => await dbContext.MessageStatuses
            .AsNoTracking()
            .Where(x => x.ConversationId == conversationId && x.ReadAt == null)
            .ToListAsync(cancellationToken);

    public async Task  UpdateStatusAsync(Ulid userId, Ulid messageId, Ulid conversationId, EMessageStatuses status, CancellationToken cancellationToken)
    {
        if (status is EMessageStatuses.READ)
        {
            await dbContext.MessageStatuses
                .Where(x => x.ConversationId == conversationId &&  x.UserId == userId &&  x.MessageId == messageId)
                .ExecuteUpdateAsync(instance => instance.SetProperty(x => x.ReadAt, DateTime.UtcNow), cancellationToken);
        }
        if (status is EMessageStatuses.RECEIVED)
        {
            await dbContext.MessageStatuses
                .Where(x => x.ConversationId == conversationId &&  x.UserId == userId &&  x.MessageId == messageId)
                .ExecuteUpdateAsync(instance => instance.SetProperty(x => x.ReceivedAt, DateTime.UtcNow), cancellationToken);
        }
    }

    public async Task ReadUnreadMessagesByUserIdAsync(Ulid userId, Ulid conversationId, CancellationToken cancellationToken)
        => await dbContext.MessageStatuses
                .Where(x =>
                    x.ConversationId == conversationId &&
                    x.UserId == userId)
                .ExecuteUpdateAsync(instance => instance.SetProperty(x =>
                    x.ReadAt,
                    entity => entity.ReadAt == null ? DateTime.UtcNow : entity.ReadAt), cancellationToken);
    
    public async Task ReceiveUnreceivedMessagesByUserIdAsync(Ulid userId, CancellationToken cancellationToken)
        => await dbContext.MessageStatuses
                .Where(x => x.UserId == userId)
                .ExecuteUpdateAsync(instance => instance.SetProperty(x =>
                    x.ReceivedAt,
                    entity => entity.ReceivedAt == null ? DateTime.UtcNow : entity.ReceivedAt), cancellationToken);
}
