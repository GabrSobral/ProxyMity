namespace ProxyMity.Infra.Database.Repositories;

public class ConversationRepository : TRepository<ConversationRepository>, IConversationRepository {
    public ConversationRepository(DbSession session) : base(session) { }

    public async Task CreateAsync(Conversation newConversation) {
        const string sql = """
            INSERT INTO "conversation" (id, group_id, created_at)
            VALUES (@id, @group_id, @createdAt);
        """;

        object parameters = new {
            id = newConversation.Id,
            group_id = newConversation.GroupId,
            createdAt = newConversation.CreatedAt,
        };

        await _session.Connection.ExecuteAsync(sql, parameters, _session.Transaction);
    }

    public async Task<Conversation?> GetByIdAsync(Guid conversationId) {
        const string sql = """
            SELECT
                id AS "Id",
                group_id AS "GroupId",
                created_at AS "CreatedAt"
            FROM "conversation"
            WHERE id = @conversationId;
        """;

        object parameters = new { conversationId };
        return await _session.Connection.QueryFirstOrDefaultAsync<Conversation>(sql, parameters);
    }
}
