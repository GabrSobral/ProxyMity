namespace ProxyMity.Server.Configuration;

public static class IoC
{
    public static IServiceCollection ConfigureIoC(this IServiceCollection services)
    {
        services.AddScoped<IPasswordEncrypter, PasswordEncrypter>();
        services.AddScoped<IJsonWebToken, JsonWebToken>();

        services.AddScoped<AuthenticateService>();
        services.AddScoped<UserService>();
        services.AddScoped<GroupService>();

        return services;
    }
}
