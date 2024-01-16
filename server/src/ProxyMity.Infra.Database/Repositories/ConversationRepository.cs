namespace ProxyMity.Infra.Database.Repositories;

public sealed class ConversationRepository(DataContext dbContext) : IConversationRepository
{
    public async Task CreateAsync(Conversation conversation, CancellationToken cancellationToken)
        => await dbContext.Conversations.AddAsync(conversation, cancellationToken);

    public async Task<Conversation?> GetByIdAsync(Ulid conversationId, CancellationToken cancellationToken)
        => await dbContext.Conversations
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == conversationId, cancellationToken);
}
