namespace ProxyMity.Server.Configuration;

public static class Authentication {
    public static IServiceCollection ConfigureAuthentication(this IServiceCollection services) {
        services
            .AddAuthentication(options => {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer();

        services.AddAuthorization();

        services.ConfigureOptions<JwtOptionsSetup>();
        services.ConfigureOptions<JwtBearerOptionsSetup>();

        return services;
    }
}
