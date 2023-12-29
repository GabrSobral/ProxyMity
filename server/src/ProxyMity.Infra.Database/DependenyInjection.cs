namespace ProxyMity.Infra.Database;

public static class DependenyInjection
{
    public static IServiceCollection AddInfraDatabase(this IServiceCollection services)
    {
        services.AddScoped<DbSession>();
        services.AddScoped<MigrationManager>();

        services.AddScoped<IUnitOfWork, UnitOfWork>();

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IGroupRepository, GroupRepository>();
        services.AddScoped<IMessageRepository, MessageRepository>();
        services.AddScoped<IParticipantRepository, ParticipantRepository>();
        services.AddScoped<IConversationRepository, ConversationRepository>();
        services.AddScoped<IMessageStatusRepository, MessageStatusRepository>();

        SqlMapper.AddTypeHandler(new BinaryUlidHandler());

        return services;
    }
}
