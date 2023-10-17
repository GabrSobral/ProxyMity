namespace ProxyMity.Application.Handlers.Conversations.Commands.CreatePrivateConversation;

internal sealed class CreatePrivateConversationCommandValidator : AbstractValidator<CreatePrivateConversationCommand> {
    public CreatePrivateConversationCommandValidator() {
        RuleFor(x => x.RequesterId)
            .NotEqual(x => x.ParticipantId)
            .WithMessage("The requester Id cannot be equal to target Id");

        RuleFor(x => x.RequesterId)
            .NotNull()
            .WithMessage("The requester Id cannot be null");

        RuleFor(x => x.RequesterId)
            .NotEmpty()
            .WithMessage("The requester Id cannot be empty");

        RuleFor(x => x.ParticipantId)
            .NotNull()
            .WithMessage("The participant Id cannot be null");

        RuleFor(x => x.ParticipantId)
            .NotEmpty()
            .WithMessage("The participant Id cannot be empty");
    }
}
