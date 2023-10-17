﻿namespace ProxyMity.Infra.Database.Repositories;

public class MessageRepository : TRepository<MessageRepository>, IMessageRepository {
    public MessageRepository(DbSession session) : base(session) { }

    public async Task CreateAsync(Message message) {
        const string sql = """
            INSERT INTO "message" (
                "id",
                "replied_message_id",
                "content",
                "conversation_id",
                "author_id",
                "written_at",
                "sent_at",
                "received_by_all_at",
                "read_by_all_at"
            ) VALUES (
                @id,
                @replied_message_id,
                @content,
                @conversation_id,
                @author_id,
                @written_at,
                @sent_at,
                @received_by_all_at,
                @read_by_all_at
            );
        """;

        object parameters = new {
            id = message.Id,
            replied_message_id = message.RepliedMessageId,
            content = message.Content,
            conversation_id = message.ConversationId,
            author_id = message.AuthorId,
            written_at = message.WrittenAt,
            sent_at = message.SentAt,
            received_by_all_at = message.ReceivedByAllAt,
            read_by_all_at = message.ReadByAllAt,
        };

        await _session.Connection.ExecuteAsync(sql, parameters, _session.Transaction);
    }

    public async Task<IEnumerable<Message>> GetMessagesFromConversationAsync(Guid conversationId, int quantity) {
        const string sql = """
            SELECT 
                id AS "Id",
                replied_message_id AS "RepliedMessageId",
                content AS "Content",
                conversation_id AS "ConversationId",
                author_id AS "AuthorId",
                written_at AS "WrittenAt",
                sent_at AS "SentAt",
                received_by_all_at AS "ReceivedByAllAt",
                read_by_all_at AS "ReadByAllAt"
            FROM "message"
            WHERE "conversation_id" = @conversationId
            ORDER BY "written_at" DESC
            LIMIT @quantity;
        """;

        object parameters = new { conversationId, quantity };
        return await _session.Connection.QueryAsync<Message>(sql, parameters);
    }

    public async Task<int> GetUnreadConversationMessagesCountAsync(Guid userId, Guid conversationId) {
        const string sql = """
            SELECT COUNT(*)
            FROM message
            WHERE 
                "conversation_id" = @conversationId AND 
                "author_id" != @userId AND
                "read_by_all_at" IS NULL;
        """;

        object parameters = new { conversationId, userId };
        return await _session.Connection.ExecuteScalarAsync<int>(sql, parameters);
    }

    public async Task ReadUnreadMessagesByConversationIdAsync(Guid userId, Guid conversationId) {
        const string sql = """
            WITH cte AS (
                SELECT "id"
                FROM "message"
                WHERE "conversation_id" = @conversationId
            )
            UPDATE "message" message
            SET "read_by_all_at" = @currentTime
            FROM cte
            WHERE message."id" = cte."id";
        """;

        object parameters = new { conversationId, currentTime = DateTime.UtcNow };
        await _session.Connection.ExecuteAsync(sql, parameters, _session.Transaction);
    }

    public async Task UpdateStatusAsync(Guid messageId, EMessageStatuses status) {

        string sql = status switch {
            EMessageStatuses.READ => """
                UPDATE FROM "message"
                SET "read_by_all_at" = @currentTime
                WHERE "id" = @messageId
            """,
            EMessageStatuses.SENT => """
                UPDATE FROM "message"
                SET "sent_at" = @currentTime
                WHERE "id" = @messageId
            """,
            EMessageStatuses.RECEIVED => """
                UPDATE FROM "message"
                SET "received_by_all_at" = @currentTime
                WHERE "id" = @messageId
            """,
            _ => throw new NotImplementedException()
        };

        object parameters = new { messageId, currentTime = DateTime.UtcNow };
        await _session.Connection.ExecuteAsync(sql, parameters, _session.Transaction);
    }
}
