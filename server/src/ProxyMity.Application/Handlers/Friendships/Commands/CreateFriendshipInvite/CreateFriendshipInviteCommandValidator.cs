namespace ProxyMity.Application.Handlers.Friendships.Commands.CreateFriendshipInvite;

public sealed class CreateFriendshipInviteCommandValidator : AbstractValidator<CreateFriendshipInviteCommand>
{
    public CreateFriendshipInviteCommandValidator()
    {
        RuleFor(x => x.TargetUserId)
            .NotNull()
            .WithMessage("the field 'TargetUserId' cannot be null.");
        
        RuleFor(x => x.RequesterUserId)
            .NotNull()
            .WithMessage("the field 'RequesterUserId' cannot be null.");

        RuleFor(x => x.RequesterUserId)
            .NotEqual(x => x.TargetUserId)
            .WithMessage("Requester Id cannot be the same as Target Id");

    }
}