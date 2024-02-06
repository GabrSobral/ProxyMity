namespace ProxyMity.Application.Handlers.Messages.Commands.ReceivePendingMessages;

/// <summary>
/// 
/// </summary>
/// <param name="logger"></param>
/// <param name="messageStatusRepository"></param>
public sealed class ReceivePendingMessagesCommandHandler(
    ILogger<ReceivePendingMessagesCommandHandler> logger,
    IMessageStatusRepository messageStatusRepository,
    DataContext dbContext
) : ICommandHandler<ReceivePendingMessagesCommand>
{
    public async Task Handle(ReceivePendingMessagesCommand command, CancellationToken cancellationToken)
    {
        logger.LogInformation($"The user '{command.AccountRequesterId}' is receiving all pending messages.");

        await messageStatusRepository.ReceiveUnreceivedMessagesByUserIdAsync(command.AccountRequesterId, cancellationToken);

        var messages = await dbContext.Messages
            .Where(x =>
                x.ReceivedByAllAt == null && 
                x.MessageStatuses.All(ms => ms.ReceivedAt != null && ms.UserId == command.AccountRequesterId))
            .ToListAsync(cancellationToken);

        await dbContext.Messages
            .Where(x =>
                x.ReceivedByAllAt == null &&
                x.MessageStatuses.All(ms => ms.ReceivedAt != null && ms.UserId == command.AccountRequesterId))
            .ExecuteUpdateAsync(x => x.SetProperty(instance => instance.ReceivedByAllAt, DateTime.UtcNow), cancellationToken); 
        
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
