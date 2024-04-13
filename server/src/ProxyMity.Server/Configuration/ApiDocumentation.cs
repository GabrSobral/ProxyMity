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

        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo { 
                Title = "ProxyMity.Server", 
                Version = "v1", 
                Contact = new OpenApiContact() {
                    Name = "ProxyMity",
                    Email = "gabriel.sobral1367@gmail.com"
                },
                Description = "The ProxyMity API that handles with user endpoints, conversation endpoints, and message endpoints. It is used for web socket connections and real time events.",
                License = new OpenApiLicense() { Name = "MIT", Url = new Uri("https://www.mit.edu/~amini/LICENSE.md") },
            });

            var xmlFilename = $"{typeof(PresentationAssemblyReference).Assembly.GetName().Name}.xml";
            options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));

            options.AddSignalRSwaggerGen();
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
