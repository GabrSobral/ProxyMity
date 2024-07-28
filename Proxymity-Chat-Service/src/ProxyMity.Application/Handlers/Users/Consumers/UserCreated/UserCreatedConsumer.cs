using MassTransit;

namespace ProxyMity.Application.Handlers.Users.Consumers.UserCreated;

public class UserCreatedConsumer : IConsumer<UserCreatedEvent>
{
    public Task Consume(ConsumeContext<UserCreatedEvent> context)
    {
        throw new NotImplementedException();
    }
}
