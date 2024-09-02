namespace ProxyMity.Application.Handlers.Calls.Commands.CreateCall;

internal sealed class CreateCallCommandValidator: AbstractValidator<CreateCallCommand>
{
    public CreateCallCommandValidator()
    {
        RuleFor(x => x.ConversationId)
            .NotNull()
            .WithMessage("The 'conversationId' field cannot be nullable");

        RuleFor(x => x.ConversationId)
            .NotNull()
            .WithMessage("The 'createdBy' field cannot be nullable");
    }
}
