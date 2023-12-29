namespace ProxyMity.Infra.Database.Repositories;

public class ConversationRepository(DbSession session) : IConversationRepository
{
    public async Task CreateAsync(Conversation newConversation)
    {
        const string sql = """
            INSERT INTO "conversation" (id, group_id, created_at)
            VALUES (@id, @group_id, @createdAt);
        """;

        object parameters = new
        {
            id = newConversation.Id,
            group_id = newConversation.GroupId,
            createdAt = newConversation.CreatedAt,
        };

        await session.Connection.ExecuteAsync(sql, parameters, session.Transaction);
    }

    public async Task<Conversation?> GetByIdAsync(Ulid conversationId)
    {
        const string sql = """
            SELECT
                id AS "Id",
                group_id AS "GroupId",
                created_at AS "CreatedAt"
            FROM "conversation"
            WHERE id = @conversationId;
        """;

        object parameters = new { conversationId };
        return await session.Connection.QueryFirstOrDefaultAsync<Conversation>(sql, parameters);
    }
}
