namespace ProxyMity.Server.Configuration;

public static class Database
{
    public static IServiceCollection ConfigureDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("PostgreSql");

#if (DEBUG)
        services.AddDbContext<DataContext>(options =>
            options.UseNpgsql(connectionString)
        );
#else
        services.AddDbContextPool<DataContext>(options =>
            options.UseNpgsql(connectionString)
        );
#endif

        services.AddScoped<DataContext>();

        return services;
    }
}
