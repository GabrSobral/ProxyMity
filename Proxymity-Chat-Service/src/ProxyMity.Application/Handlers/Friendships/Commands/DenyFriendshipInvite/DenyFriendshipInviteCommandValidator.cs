﻿namespace ProxyMity.Application.Handlers.Friendships.Commands.DenyFriendshipInvite;

public sealed class DenyFriendshipInviteCommandValidator : AbstractValidator<DenyFriendshipInviteCommand>
{
    public DenyFriendshipInviteCommandValidator()
    {
        RuleFor(x => x.CurrentUserId)
            .NotNull()
            .WithMessage("the field 'CurrentUserId' cannot be null.");
        
        RuleFor(x => x.RequesterUserId)
            .NotNull()
            .WithMessage("the field 'RequesterUserId' cannot be null.");
        
        RuleFor(x => x.RequesterUserId)
            .NotEqual(x => x.CurrentUserId)
            .WithMessage("Requester Id cannot be the same as Current Id");
    }
}