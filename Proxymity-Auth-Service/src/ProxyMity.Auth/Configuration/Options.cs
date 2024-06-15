namespace ProxyMity.Auth.Configuration;

public static class Options
{
    public static IServiceCollection ConfigureOptions(this IServiceCollection services, IConfiguration configuration)
    {
        services.ConfigureOptions<JwtOptionsSetup>();
        services.ConfigureOptions<JwtBearerOptionsSetup>();
        services.ConfigureOptions<MessageBrokerSettingsSetup>();

        return services;
    }
}
