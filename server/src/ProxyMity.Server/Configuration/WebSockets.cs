namespace ProxyMity.Server.Configuration;

public static class WebSockets
{
    public static WebApplication ConfigureWebSockets(this WebApplication app)
    {
        app.MapHub<ChatHub>("chat")
            .RequireAuthorization();

        return app;
    }
}
