namespace ProxyMity.Server.Configuration;

public static class EndPoints
{
    public static IApplicationBuilder ConfigureEndPoints(this IApplicationBuilder app)
    {
        app.UseRouting();

        app.UseCors();

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapAuthenticationEndPoints();

            endpoints.MapConversationEndpoints();

            endpoints.MapUserEndpoints();

            endpoints.MapMessageEndpoints();
        });

        return app;
    }
}