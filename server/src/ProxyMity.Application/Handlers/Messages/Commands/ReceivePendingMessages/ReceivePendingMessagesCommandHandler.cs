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
    public async Task Handle(
        ReceivePendingMessagesCommand command, 
        CancellationToken cancellationToken)
    {
        logger.LogInformation($"The user '{command.AccountRequesterId}' is receiving all pending messages.");

        await messageStatusRepository.ReceiveUnreceivedMessagesByUserIdAsync(command.AccountRequesterId, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
