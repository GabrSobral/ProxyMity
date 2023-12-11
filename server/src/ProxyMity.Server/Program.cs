internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services
            .AddApplication()
            .AddInfraDatabase()
            .AddPresentation()
            .ConfigureCors()
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