using Microsoft.Extensions.Logging;

using ProxyMity.Domain.Entities;
using ProxyMity.Infra.Messaging.Messages;
using ProxyMity.Infra.Database.Contexts;

namespace ProxyMity.Infra.Messaging.Consumers.UserCreated;

public sealed class UserCreatedConsumer(
    ILogger<UserCreatedConsumer> logger,
    DataContext dbContext
) : IConsumer<UserCreatedEvent>
{

    public async Task Consume(ConsumeContext<UserCreatedEvent> context)
    {
        var user = new User () 
        {
            Id = Ulid.Parse(context.Message.Id),
            FirstName = context.Message.FirstName, 
            LastName = context.Message.LastName ?? string.Empty, 
            Email = context.Message.Email.ToLower(),
            CreatedAt = context.Message.CreatedAt
        };

        await dbContext.Users.AddAsync(user);
        await dbContext.SaveChangesAsync();

        logger.LogInformation("User was created on Auth minisservice. {@User}", context.MessageId);
    }
}
