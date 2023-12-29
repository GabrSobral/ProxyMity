namespace ProxyMity.Infra.Database.Migrations.Commands;

internal static class ConversationTableScript
{
    public static string Create() => $"{Table()} {Indexes()}";

    private static string Table() => """
        CREATE TABLE IF NOT EXISTS "conversation" (
            "id"            BYTEA NOT NULL,
            "group_id"      BYTEA,
            "created_at"    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            "updated_at"    TIMESTAMPTZ,

            PRIMARY KEY ("id"),
            FOREIGN KEY ("group_id") REFERENCES "group" ("id")
        );
    """;

    private static string Indexes() => "";
}
