namespace ProxyMity.Application.Handlers.Messages.Commands.SaveMessage;

public record SaveMessageCommand(
    Message Message
) : ICommand;
