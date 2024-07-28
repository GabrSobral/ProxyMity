namespace ProxyMity.Infra.Messaging;

public sealed class EventBus(IPublishEndpoint publishEndpoint) : IEventBus
{
    public Task PublishAsync<T>(T message, CancellationToken cancellationToken = default) where T : class
    {
        return publishEndpoint.Publish<T>(message, cancellationToken);
    }
}
