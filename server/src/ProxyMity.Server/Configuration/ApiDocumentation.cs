namespace ProxyMity.Server.Configuration;

public static class ApiDocumentation
{
    public static IServiceCollection ConfigureApiDocumentation(this IServiceCollection services)
    {
        services.AddApiVersioning(config =>
        {
            config.DefaultApiVersion = new ApiVersion(1, 0);
            config.ReportApiVersions = true;
            config.AssumeDefaultVersionWhenUnspecified = true;

            config.ApiVersionReader = ApiVersionReader.Combine(
                new HeaderApiVersionReader("Api-Version"),
                new QueryStringApiVersionReader("Query-String-Version")
            );
        });

        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "ProxyMity.Server", Version = "v1" });

            c.AddSignalRSwaggerGen();
        });

        services.AddEndpointsApiExplorer();

        return services;
    }

    public static IApplicationBuilder ConfigureApiDocumentationUI(this IApplicationBuilder app, bool isDevelopment)
    {
        if (isDevelopment)
        {
            app.UseDeveloperExceptionPage();
            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "ProxyMity.Server v1"));
        }

        return app;
    }
}
