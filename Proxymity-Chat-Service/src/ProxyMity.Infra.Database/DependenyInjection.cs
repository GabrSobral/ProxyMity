using Microsoft.Extensions.Configuration;

namespace ProxyMity.Infra.Database;

public static class DependenyInjection
{
    public static IServiceCollection AddInfraDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IGroupRepository, GroupRepository>();
        services.AddScoped<IMessageRepository, MessageRepository>();
        services.AddScoped<IParticipantRepository, ParticipantRepository>();
        services.AddScoped<IConversationRepository, ConversationRepository>();
        services.AddScoped<IMessageStatusRepository, MessageStatusRepository>();
        services.AddScoped<IFriendshipRepository, FriendshipRepository>();

        string connectionString = configuration.GetConnectionString("PostgreSql")!;

        services.AddDbContextPool<DataContext>(options =>
            options.UseNpgsql(connectionString));

        return services;
    }
}
