using ProxyMity.Infra.Messaging.Messages;
using RabbitMQ.Client;

namespace ProxyMity.Infra.Messaging;

public static class DependenyInjection
{
    public static IServiceCollection AddInfraMessaging(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddMassTransit(busConfigurator =>
        {
            busConfigurator.SetKebabCaseEndpointNameFormatter();

            busConfigurator.UsingRabbitMq((context, config) =>
            {
                // MessageBrokerSettings settings = context.GetRequiredService<MessageBrokerSettings>();
                var host = configuration.GetSection("MessageBroker:Host").Value ?? "";
                var username = configuration.GetSection("MessageBroker:Username").Value ?? "";
                var password = configuration.GetSection("MessageBroker:Password").Value ?? "";

                config.Host(new Uri(host), hostConfig =>
                {
                    hostConfig.Username(username);
                    hostConfig.Password(password);
                });

                config.ConfigureEndpoints(context);

                config.UseMessageRetry(retryConfig =>
                {
                    retryConfig.Interval(5, TimeSpan.FromSeconds(10));
                });
            });
        });

        services.AddTransient<IEventBus, EventBus>();

        return services;
    }
}
