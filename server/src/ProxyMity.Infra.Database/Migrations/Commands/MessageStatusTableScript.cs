namespace ProxyMity.Infra.Database.Migrations.Commands;

internal static class MessageStatusTableScript {
    public static string Create() => $"{Table()} {Indexes()}";

    private static string Table() => """
        CREATE TABLE IF NOT EXISTS "message_status" (
            "user_id"           UUID NOT NULL,
            "conversation_id"   UUID NOT NULL,
            "message_id"        UUID NOT NULL,
            "received_at"       TIMESTAMPTZ,
            "read_at"           TIMESTAMPTZ,

            PRIMARY KEY ("user_id", "message_id", "conversation_id"),

            FOREIGN KEY ("user_id")         REFERENCES "user" ("id"),
            FOREIGN KEY ("conversation_id") REFERENCES "conversation" ("id"),
            FOREIGN KEY ("message_id")      REFERENCES "message" ("id")
        );
    """;

    private static string Indexes() => @"";
}
