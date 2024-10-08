﻿namespace ProxyMity.Presentation;

public static class DependencyInjection
{
    public static IServiceCollection AddPresentation(this IServiceCollection services)
    {
        services.AddHttpContextAccessor();
        
        services.AddControllers();
        services.AddSignalR();

        return services;
    }
}
