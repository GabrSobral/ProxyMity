internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services
            .ConfigureControllers()
            .ConfigureIoC()
            .ConfigureServices()
            .ConfigureDatabase(builder.Configuration)
            .ConfigureApiDocumentation();

        var app = builder.Build();

        app.ConfigureApiDocumentationUI(app.Environment.IsDevelopment());

        app.UseAuthorization();

        app.ConfigureMiddlewares();
        app.ConfigureEndPoints();

        app.Run();
    }
}