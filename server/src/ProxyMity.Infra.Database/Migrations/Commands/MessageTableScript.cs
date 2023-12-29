namespace ProxyMity.Infra.Database.Migrations.Commands;

internal static class MessageTableScript
{
    public static string Create() => $"{Table()} {Indexes()}";

    private static string Table() => """
        CREATE TABLE IF NOT EXISTS "message" (
            "id"                    BYTEA NOT NULL,
            "conversation_id"       BYTEA NOT NULL,
            "author_id"             BYTEA NOT NULL,
            "replied_message_id"    BYTEA,
            "content"               VARCHAR(1000),
            "written_at"            TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            "sent_at"               TIMESTAMPTZ,
            "received_by_all_at"    TIMESTAMPTZ,
            "read_by_all_at"        TIMESTAMPTZ,

            PRIMARY KEY ("id"),

            FOREIGN KEY ("author_id")       REFERENCES "user" ("id"),
            FOREIGN KEY ("conversation_id") REFERENCES "conversation" ("id")
        );
    """;

    private static string Indexes() => @"";
}
