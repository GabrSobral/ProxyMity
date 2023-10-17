namespace ProxyMity.Application.Handlers.Conversations.Commands.ReadConversationMessages;

public class ReadConversationMessagesCommandValidator : AbstractValidator<ReadConversationMessagesCommand> {
    public ReadConversationMessagesCommandValidator() {
        RuleFor(x => x.UserId)
            .NotNull()
            .WithMessage("The user Id cannot be null");

        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("The user Id cannot be empty");

        RuleFor(x => x.ConversationId)
            .NotEmpty()
            .WithMessage("The user Id cannot be null");

        RuleFor(x => x.ConversationId)
            .NotEmpty()
            .WithMessage("The user Id cannot be empty");
    }
}
