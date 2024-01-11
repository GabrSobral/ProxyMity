namespace ProxyMity.Application.Handlers.Messages.Commands.ReceivePendingMessages;

public record ReceivePendingMessagesCommand(
    Ulid AccountRequesterId
): ICommand;
