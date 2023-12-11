namespace ProxyMity.Infra.Database.Repositories;

public class ParticipantRepository : TRepository<ParticipantRepository>, IParticipantRepository
{
    public ParticipantRepository(DbSession session) : base(session) { }

    public async Task AddAsync(Participant participant)
    {
        const string sql = """
            INSERT INTO "participant" (user_id, conversation_id, created_at)
            VALUES (@user_id, @conversation_id, @created_at);
        """;

        object parameters = new
        {
            user_id = participant.UserId,
            conversation_id = participant.ConversationId,
            created_at = participant.CreatedAt,
        };

        await _session.Connection.ExecuteAsync(sql, parameters, _session.Transaction);
    }

    public async Task<IEnumerable<Participant>> GetByConversationIdAsync(Guid conversationId)
    {
        const string sql = """
            SELECT 
                user_id as "UserId", 
                conversation_id as "ConversationId", 
                created_at as "CreatedAt"
            FROM "participant"
            WHERE conversation_id = @conversationId
        """;

        object parameters = new { conversationId };
        return await _session.Connection.QueryAsync<Participant>(sql, parameters);
    }

    public async Task<IEnumerable<GetConversationsByUserIdQuery>> GetConversationsByUserIdAsync(Guid userId)
    {
        const string sql = """
            SELECT 
              "conversation"."id" AS "Id", 
              "conversation"."created_at" AS "CreatedAt",
              "group"."name" AS "GroupName",
              "group"."description" AS "GroupDescription",
              "conversation"."group_id" AS "GroupId"
            FROM "participant"
            INNER JOIN "conversation" ON "conversation"."id" = "participant"."conversation_id"
            LEFT JOIN "group" ON "conversation"."group_id" = "group"."id"
            WHERE "participant"."user_id" = @userId 
        """;

        object parameters = new { userId };
        return await _session.Connection.QueryAsync<GetConversationsByUserIdQuery>(sql, parameters);
    }

    public async Task<IEnumerable<Participant>> GetByUserIdAsync(Guid userId)
    {
        const string sql = """
            SELECT 
                user_id as "UserId", 
                conversation_id as "ConversationId", 
                created_at as "CreatedAt"
            FROM "participant"
            WHERE user_id = @userId
        """;

        object parameters = new { userId };
        return await _session.Connection.QueryAsync<Participant>(sql, parameters);
    }

    public async Task<IEnumerable<GetParticipantsByConversationIdQuery>> GetParticipantsByConversationIdAsync(Guid conversationId)
    {
        const string sql = """
            SELECT 
              "user"."id" AS "Id",
              "user"."name" AS "Name",
              "user"."email" AS "Email",
              "user"."photo_url" as "PhotoUrl",
              "user"."last_online" as "LastOnline",
              "participant"."created_at" AS "CreatedAt",
              "participant"."removed_at" AS "RemovedAt"
            FROM "participant"
            INNER JOIN "user" ON "user"."id" = "participant"."user_id"
            WHERE "participant"."conversation_id" = @conversationId 
        """
        ;

        object parameters = new { conversationId };
        return await _session.Connection.QueryAsync<GetParticipantsByConversationIdQuery>(sql, parameters);
    }

    public async Task RemoveAsync(Participant participant)
    {
        const string sql = """
            DELETE FROM participant 
            WHERE 
                user_id = @userId AND
                conversation_id = @conversationId
        """
;
        object parameters = new { userId = participant.UserId, conversationId = participant.ConversationId };
        await _session.Connection.ExecuteAsync(sql, parameters, _session.Transaction);
    }

    public async Task<Participant?> GetByIdAsync(Guid userId, Guid conversationId)
    {
        const string sql = """
            SELECT
                "user_id",
                "conversation_id",
                "created_at",
                "removed_at"
            FROM participant 
            WHERE 
                user_id = @userId AND
                conversation_id = @conversationId
        """;

        object parameters = new { userId, conversationId };
        return await _session.Connection.QueryFirstOrDefaultAsync<Participant>(sql, parameters);
    }
}
