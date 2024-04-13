namespace ProxyMity.Server.Configuration;

public static class WebSockets
{
    public const string HubName = "chat";

    public static WebApplication ConfigureWebSockets(this WebApplication app)
    {
        app.MapHub<ChatHub>(HubName);

        return app;
    }
}
