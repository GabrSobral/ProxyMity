namespace ProxyMity.Server.Configuration;

public static class Services
{
    public static IServiceCollection ConfigureServices(this IServiceCollection services)
    {
        IMapper mapper = MapConfig.RegisterMaps().CreateMapper();

        services.AddSingleton(mapper);
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

        return services;
    }
}
