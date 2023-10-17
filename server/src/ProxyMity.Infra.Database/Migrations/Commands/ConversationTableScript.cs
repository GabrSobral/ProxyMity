namespace ProxyMity.Infra.Database.Migrations.Commands;

internal static class ConversationTableScript {
    public static string Create() => $"{Table()} {Indexes()}";

    private static string Table() => """
        CREATE TABLE IF NOT EXISTS "conversation" (
            "id"            UUID NOT NULL,
            "group_id"      UUID,
            "created_at"    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            "updated_at"    TIMESTAMPTZ,

            PRIMARY KEY ("id"),
            FOREIGN KEY ("group_id") REFERENCES "group" ("id")
        );
    """;

    private static string Indexes() => "";
}
