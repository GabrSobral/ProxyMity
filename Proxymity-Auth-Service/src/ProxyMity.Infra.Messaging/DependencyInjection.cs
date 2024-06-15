using Microsoft.Extensions.Logging;

namespace ProxyMity.Infra.Messaging;

public static class DependenyInjection
{
    public static IServiceCollection AddInfraMessaging(this IServiceCollection services, IConfiguration configuration)
    {

        string connectionString = configuration.GetConnectionString("PostgreSql")!;

        services.AddMassTransit(busConfigurator =>
        {
            busConfigurator.SetKebabCaseEndpointNameFormatter();

            busConfigurator.UsingRabbitMq((context, config) =>
            {
                // MessageBrokerSettings settings = context.GetRequiredService<MessageBrokerSettings>();
                var host = configuration.GetSection("MessageBroker:Host").Value ?? "";
                var username = configuration.GetSection("MessageBroker:Username").Value ?? "";
                var password = configuration.GetSection("MessageBroker:Password").Value ?? "";

                try
                {
                    config.Host(new Uri(host), hostConfig =>
                    {
                        hostConfig.Username(username);
                        hostConfig.Password(password);
                        hostConfig.ConnectionName("proxymity-auth-rabbitmq");
                    });

                    config.ConfigureEndpoints(context);

                    config.UseMessageRetry(retryConfig =>
                    {
                        retryConfig.Interval(5, TimeSpan.FromSeconds(10));
                    });
                }
                catch (Exception ex)
                {
                    throw;
                }

            });
        });

        services.AddTransient<IEventBus, EventBus>();

        return services;
    }
}
