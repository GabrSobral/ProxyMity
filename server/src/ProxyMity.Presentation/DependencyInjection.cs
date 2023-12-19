using MessagePack;

namespace ProxyMity.Presentation;

public static class DependencyInjection
{
    public static IServiceCollection AddPresentation(this IServiceCollection services)
    {
        services.AddSignalR();

        return services;
    }
}
