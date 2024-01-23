namespace ProxyMity.Infra.Database.Repositories;

public sealed class MessageRepository(DataContext dbContext) : IMessageRepository
{
    public async Task CreateAsync(Message message, CancellationToken cancellationToken)
        => await dbContext.Messages.AddAsync(message, cancellationToken);

    public async Task<Message?> GetById(Ulid messageId, CancellationToken cancellationToken)
    {
        return await dbContext.Messages
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == messageId, cancellationToken);
    }

    public async Task<IEnumerable<Message>> GetMessagesFromConversationAsync(Ulid conversationId, int quantity, CancellationToken cancellationToken)
        => await dbContext.Messages
            .AsNoTracking()
            .Where(x => x.ConversationId == conversationId)
            .Include(x => x.RepliedMessage)
            .OrderByDescending(x => x.Id)
            .Take(quantity)
            .ToListAsync(cancellationToken);

    public async Task<int> GetUnreadConversationMessagesCountAsync(Ulid userId, Ulid conversationId, CancellationToken cancellationToken)
        => await dbContext.Messages
            .AsNoTracking()
            .Where(x =>
                x.ConversationId == conversationId &&
                x.AuthorId != userId &&
                x.ReadByAllAt == null
             )
            .CountAsync(cancellationToken);

    public async Task ReadUnreadMessagesByConversationIdAsync(Ulid userId, Ulid conversationId, CancellationToken cancellationToken)
    {
        var messageIds = await dbContext.Messages
            .Where(x =>
                x.ConversationId == conversationId &&
                x.ReadByAllAt == null)
            .Select(x => x.Id)
            .ToListAsync(cancellationToken);

        await dbContext.Messages
            .Where(message => messageIds.Contains(message.Id))
            .ExecuteUpdateAsync(instance =>
                instance.SetProperty(message =>
                    message.ReadByAllAt,
                    entity => entity.ReadByAllAt == null ? DateTime.UtcNow : entity.ReadByAllAt),
                    cancellationToken
            );
    }

    public async Task UpdateStatusAsync(Ulid messageId, EMessageStatuses status, CancellationToken cancellationToken)
    {
        switch(status) 
        {
            case EMessageStatuses.READ:
                await dbContext.Messages
                    .Where(message => message.Id == messageId)
                    .ExecuteUpdateAsync(instance => instance.SetProperty(message => message.ReadByAllAt, DateTime.UtcNow), cancellationToken);
                break;

            case EMessageStatuses.RECEIVED:
                await dbContext.Messages
                    .Where(message => message.Id == messageId)
                    .ExecuteUpdateAsync(instance => instance.SetProperty(message => message.ReceivedByAllAt, DateTime.UtcNow), cancellationToken);
                break;

            case EMessageStatuses.SENT:
                await dbContext.Messages
                    .Where(message => message.Id == messageId)
                    .ExecuteUpdateAsync(instance => instance.SetProperty(message => message.SentAt, DateTime.UtcNow), cancellationToken);
                break;
        }
    }
}
