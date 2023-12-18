namespace ProxyMity.Application.Handlers.Authentication.SignUp;

/// <summary>
/// 
/// </summary>
internal sealed class SignUpCommandValidator : AbstractValidator<SignUpCommand>
{
    public SignUpCommandValidator(IUserRepository userRepository)
    {
        RuleFor(x => x.Email)
            .NotNull().WithMessage("Email address cannot be null")
            .NotEmpty().WithMessage("Email address cannot be empty")
            .EmailAddress().WithMessage("Email address must be a valid email");

        RuleFor(x => x.Email)
            .MustAsync(async (email, _) => {
                var existantUser = await userRepository.FindByEmailAsync(email.ToLower());

                if (existantUser is not null)
                    throw new UserAlreadyExistException();

                return true;
            }).WithMessage("User already exists");
    }
}
