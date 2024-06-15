namespace ProxyMity.Application.Handlers.Authentication.ConfirmEmail;

public sealed class ConfirmEmailCommandValidator: AbstractValidator<ConfirmEmailCommand>
{
    public ConfirmEmailCommandValidator()
    {
        RuleFor(x => x.Token)
            .NotNull();
    }
}
