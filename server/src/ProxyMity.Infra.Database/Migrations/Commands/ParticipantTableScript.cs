namespace ProxyMity.Infra.Database.Migrations.Commands;

internal static class ParticipantTableScript
{
    public static string Create() => $"{Table()} {Indexes()}";

    private static string Table() => """
        CREATE TABLE IF NOT EXISTS "participant" (
            "user_id"           BYTEA        NOT NULL,
            "conversation_id"   BYTEA        NOT NULL,
            "created_at"        TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            "removed_at"        TIMESTAMPTZ,

            PRIMARY KEY ("user_id", "conversation_id"),

            FOREIGN KEY ("user_id")         REFERENCES "user" ("id"), 
            FOREIGN KEY ("conversation_id") REFERENCES "conversation" ("id")
        );
    """;

    private static string Indexes() => "";
}
