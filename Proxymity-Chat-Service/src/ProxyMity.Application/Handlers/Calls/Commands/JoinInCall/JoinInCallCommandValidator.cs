namespace ProxyMity.Application.Handlers.Calls.Commands.JoinInCall;

internal sealed class JoinInCallCommandValidator: AbstractValidator<JoinInCallCommand>
{
    public JoinInCallCommandValidator()
    {
        RuleFor(x => x.CallId)
           .NotNull()
           .WithMessage("The 'callId' field cannot be nullable");

        RuleFor(x => x.UserId)
            .NotNull()
            .WithMessage("The 'userId' field cannot be nullable");
    }
}
