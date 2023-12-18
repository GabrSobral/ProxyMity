namespace ProxyMity.Application.Handlers.Authentication.SignUp;

/// <summary>
/// 
/// </summary>
internal class SignUpCommandValidator : AbstractValidator<SignUpCommand>
{
    public SignUpCommandValidator(IUserRepository userRepository)
    {
        RuleFor(x => x.Email)
            .NotNull().WithMessage("Email address cannot be null")
            .NotEmpty().WithMessage("Email address cannot be empty")
            .EmailAddress().WithMessage("Email address must be a valid email");

        RuleFor(x => x.Email)
            .MustAsync(async (email, cancellationToken) => {
                if (await userRepository.FindByEmailAsync(email, cancellationToken) is not null)
                    throw new UserAlreadyExistException();

                return true;
            });
    }
}
