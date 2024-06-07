namespace ProxyMity.Application.Handlers.Conversations.Commands.CreateGroupConversation;

internal sealed class CreateGroupConversationCommandValidator : AbstractValidator<CreateGroupConversationCommand>
{
    public CreateGroupConversationCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotNull()
            .WithMessage("The group conversation must have a name.");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("The group conversation must have a name.");

        RuleFor(x => x.Participants)
            .NotEmpty()
            .WithMessage("Participants must be passed to body request");

        RuleFor(x => x.Participants.Count())
            .GreaterThanOrEqualTo(2)
            .WithMessage("The group conversation must have more than 1 participants.");
    }
}
