namespace ProxyMity.Infra.Database.Repositories;

public class MessageStatusRepository(DbSession session) : IMessageStatusRepository
{
    public async Task CreateAsync(MessageStatus messageStatus)
    {
        const string sql = """
            INSERT INTO "message_status" (
                "conversation_id",
                "message_id",
                "user_id",
                "read_at",
                "received_at"
            ) VALUES (
                @conversationId,
                @messageId,
                @userId,
                @readAt,
                @receivedAt
            );
        """;

        object parameters = new
        {
            conversationId = messageStatus.ConversationId,
            messageId = messageStatus.MessageId,
            userId = messageStatus.UserId,
            readAt = messageStatus.ReadAt,
            receivedAt = messageStatus.ReceivedAt,
        };

        await session.Connection.ExecuteAsync(sql, parameters, session.Transaction);
    }

    public async Task<IEnumerable<MessageStatus>> GetMessagesStatusByMessageIdAsync(Ulid messageId, Ulid conversationId)
    {
        const string sql = """
            SELECT *
            FROM "message_status"
            WHERE "message_id" = @messageId
                AND "conversation_id" = @conversationId
                AND "received_at" IS NULL;
        """;

        object parameters = new { conversationId, messageId };
        return await session.Connection.QueryAsync<MessageStatus>(sql, parameters);
    }

    public async Task<int> GetUnreadMessagesStatusCountByUserIdAsync(Ulid userId, Ulid conversationId)
    {
        const string sql = """
            SELECT COUNT(*)
            FROM "message_status"
            WHERE "user_id" = @userId
                AND "conversation_id" = @conversationId
                AND "read_at" IS NULL;
        """;

        object parameters = new { conversationId, userId };
        return await session.Connection.ExecuteScalarAsync<int>(sql, parameters);
    }

    public async Task<IEnumerable<MessageStatus>> GetUnreadMessagesStatusFromConversationByIdAsync(Ulid conversationId)
    {
        const string sql = """
            SELECT *
            FROM "message_status"
            WHERE "conversation_id" = @conversationId
                AND "read_at" IS NULL;
        """;

        object parameters = new { conversationId };
        return await session.Connection.QueryAsync<MessageStatus>(sql, parameters);
    }

    public async Task ReadAsync(Ulid userId, Ulid messageId)
    {
        const string sql = """
            UPDATE "message_status"
            SET "read_at" = @currentTime
            WHERE "message_id" = @messageId
                AND "user_id" = @userId;
        """;

        object parameters = new { userId, messageId, currentTime = DateTime.UtcNow };
        await session.Connection.QueryAsync<MessageStatus>(sql, parameters, session.Transaction);
    }

    public async Task ReadUnreadMessagesByUserIdAsync(Ulid userId, Ulid conversationId)
    {
        const string sql = """
            UPDATE "message_status"
            SET "read_at" = @currentTime
            WHERE "conversation_id" = @conversationId;
        """;

        object parameters = new { userId, conversationId, currentTime = DateTime.UtcNow };
        await session.Connection.QueryAsync<MessageStatus>(sql, parameters, session.Transaction);
    }

    public async Task ReceiveAsync(Ulid userId, Ulid messageId)
    {
        const string sql = """
            UPDATE "message_status"
            SET "received_at" = @currentTime
            WHERE "message_id" = @messageId
                AND "user_id" = @userId;
        """;

        object parameters = new { userId, messageId, currentTime = DateTime.UtcNow };
        await session.Connection.QueryAsync<MessageStatus>(sql, parameters, session.Transaction);
    }

    public async Task ReceiveUnreceivedMessagesByUserIdAsync(Ulid userId)
    {
        const string sql = """
            UPDATE "message_status"
            SET "received_at" = @currentTime
            WHERE
        	    "user_id" = @userId AND
                "received_at" IS NULL;

            UPDATE "message"
            SET "received_by_all_at" = @currentTime
            FROM "conversation" c
            WHERE "message"."conversation_id" = c."id"
              AND c."group_id" IS NULL
              AND "message"."received_by_all_at" IS NULL
              AND "message"."author_id" != @userId
              AND EXISTS (
                SELECT 1
                FROM "participant" p
                WHERE p."user_id" = @userId
                  AND p."conversation_id" = c."id"
          );
        """;

        object parameters = new { userId, currentTime = DateTime.UtcNow };

        await session.Connection.QueryAsync(sql, parameters, session.Transaction);
    }
}
