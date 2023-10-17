namespace ProxyMity.Infra.Database.Migrations.Commands;

internal static class GroupTableScript {
    public static string Create() => $"{Table()} {Indexes()}";

    private static string Table() => """
        CREATE TABLE IF NOT EXISTS "group" (
            "id"            UUID NOT NULL,
            "name"          VARCHAR(90),
            "description"   VARCHAR(240),
            "created_at"    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            "updated_at"    TIMESTAMPTZ,
            "created_by"    UUID NOT NULL,

            PRIMARY KEY ("id"),
            FOREIGN KEY ("created_by") REFERENCES "user" ("id")
        );
    """;

    private static string Indexes() => @"";
}
