namespace ProxyMity.Application.Handlers.Messages.Commands.ReceivePendingMessages;

/// <summary>
/// 
/// </summary>
/// <param name="logger"></param>
/// <param name="messageStatusRepository"></param>
public sealed class ReceivePendingMessagesCommandHandler(
    ILogger<ReceivePendingMessagesCommandHandler> logger,
    IMessageStatusRepository messageStatusRepository,
    IUnitOfWork unitOfWork) : ICommandHandler<ReceivePendingMessagesCommand>
{
    public async Task Handle(
        ReceivePendingMessagesCommand command, 
        CancellationToken cancellationToken)
    {
        logger.LogInformation($"The user '{command.AccountRequesterId}' is receiving all pending messages.");

        unitOfWork.BeginTransaction();

        await messageStatusRepository.ReceiveUnreceivedMessagesByUserIdAsync(command.AccountRequesterId);

        await unitOfWork.CommitAsync(cancellationToken);
    }
}
