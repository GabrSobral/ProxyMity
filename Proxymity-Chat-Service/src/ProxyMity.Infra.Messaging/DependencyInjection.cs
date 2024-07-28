using ProxyMity.Infra.Messaging.Consumers.UserCreated;

namespace ProxyMity.Infra.Messaging;

public static class DependenyInjection
{
    public static IServiceCollection AddInfraMessaging(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddMassTransit(busConfigurator =>
        {
            busConfigurator.SetKebabCaseEndpointNameFormatter();

            busConfigurator.AddConsumer<UserCreatedConsumer>();

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
            });
        });

        services.AddTransient<IEventBus, EventBus>();

        return services;
    }
}
