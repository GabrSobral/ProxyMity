namespace ProxyMity.Server.Configuration;

public static class Endpoint
{
    public static IApplicationBuilder ConfigureEndPoints(this IApplicationBuilder app)
    {
        app.UseRouting();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });

        return app;
    }
}