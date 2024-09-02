namespace ProxyMity.Server.Configuration;

public static class Cors
{
    public const string POLICY_NAME = "DefaultPolicy";

    public static IServiceCollection ConfigureCors(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                policy
                    .WithOrigins("http://localhost:5173", "http://localhost:4173", "*", "http://192.168.0.78:5173")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
            });
        });

        return services;
    }
}
