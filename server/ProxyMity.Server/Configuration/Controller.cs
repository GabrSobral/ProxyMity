namespace ProxyMity.Server.Configuration;

public static class Controller
{
    public static IServiceCollection ConfigureControllers(this IServiceCollection services)
    {
        services.AddControllers();

        return services;
    }
}
