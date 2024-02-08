namespace ProxyMity.Application.Handlers.Friendships.Commands.AcceptFriendshipInvite;

public class AcceptFriendshipInviteCommandValidator : AbstractValidator<AcceptFriendshipInviteCommand>
{
    public AcceptFriendshipInviteCommandValidator()
    {
        RuleFor(x => x.CurrentUserId)
            .NotNull()
            .WithMessage("the field 'CurrentUserId' cannot be null.");
        
        RuleFor(x => x.RequesterUserId)
            .NotNull()
            .WithMessage("the field 'RequesterUserId' cannot be null.");
    }
}