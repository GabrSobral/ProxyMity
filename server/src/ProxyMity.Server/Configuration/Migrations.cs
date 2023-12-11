namespace ProxyMity.Server.Configuration;

public static class Migrations
{
    public static WebApplication ExecuteMigration(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var serviceProvider = scope.ServiceProvider;

        var scopedMigrationManager = serviceProvider.GetRequiredService<MigrationManager>();
        scopedMigrationManager.CheckIfTablesExist().GetAwaiter().GetResult();

        return app;
    }
}
