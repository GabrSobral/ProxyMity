namespace ProxyMity.Infra.Database.Migrations.Commands;

internal static class UserTableScript {
    public static string Create() => $"{Table()} {Indexes()}";

    private static string Table() => """
        CREATE TABLE IF NOT EXISTS "user" (
            "id"            UUID         NOT NULL,
            "name"          VARCHAR(120) NOT NULL,
            "email"         VARCHAR(120) NOT NULL UNIQUE,
            "password"      VARCHAR(240) NOT NULL,
            "last_online"   TIMESTAMPTZ,
            "bio"           VARCHAR(240),
            "created_at"    TIMESTAMPTZ  DEFAULT CURRENT_TIMESTAMP,
            "updated_at"    TIMESTAMPTZ,
            "photo_url"     VARCHAR(240),

            PRIMARY KEY ("id")
        );
    """;

    private static string Indexes() => """
        CREATE INDEX IF NOT EXISTS IDX_User_Email ON "user" (email);
    """;
}
