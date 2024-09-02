namespace ProxyMity.Server.Configuration;

public static class WebSockets
{
    public const string ChatHubName = "chat";

    public static WebApplication ConfigureWebSockets(this WebApplication app)
    {
        app.MapHub<ChatHub>(ChatHubName);

        return app;
    }
}
