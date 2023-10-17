internal class Program {
    private static void Main(string[] args) {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services
            .AddApplication()
            .AddPresentation()
            .AddInfraDatabase()
            .ConfigureAuthentication()
            .ConfigureApiDocumentation();

        var app = builder.Build();

        app.ExecuteMigration();

        app.ConfigureApiDocumentationUI(app.Environment.IsDevelopment());

        app.ConfigureMiddlewares();
        app.ConfigureEndPoints();
        app.ConfigureWebSockets();

        app.Run();
    }
}