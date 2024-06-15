namespace ProxyMity.Auth.OptionsSetup;

public class MessageBrokerSettingsSetup(IConfiguration configuration) : IConfigureOptions<MessageBrokerSettings>
{
    private const string SectionName = "MessageBroker";

    public void Configure(MessageBrokerSettings options)
    {
        configuration.GetSection(SectionName).Bind(options);
    }
}
