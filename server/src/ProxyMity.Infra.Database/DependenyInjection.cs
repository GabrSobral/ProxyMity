namespace ProxyMity.Infra.Database;

public static class DependenyInjection
{
    public static IServiceCollection AddInfraDatabase(this IServiceCollection services)
    {
        services.AddScoped<DbSession>();
        services.AddScoped<MigrationManager>();

        services.AddTransient<IUnitOfWork, UnitOfWork>();

        services.AddTransient<IUserRepository, UserRepository>();
        services.AddTransient<IGroupRepository, GroupRepository>();
        services.AddTransient<IMessageRepository, MessageRepository>();
        services.AddTransient<IParticipantRepository, ParticipantRepository>();
        services.AddTransient<IConversationRepository, ConversationRepository>();
        services.AddTransient<IMessageStatusRepository, MessageStatusRepository>();

        return services;
    }
}
