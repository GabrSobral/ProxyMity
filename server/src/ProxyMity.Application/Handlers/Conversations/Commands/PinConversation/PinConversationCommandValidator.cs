namespace ProxyMity.Application.Handlers.Conversations.Commands.PinConversation;

public sealed class UnpinConversationCommandValidator: AbstractValidator<PinConversationCommand>
{
    public UnpinConversationCommandValidator(DataContext dbContext)
    {
        RuleFor(x => x.ConversationId)
            .NotNull()
            .WithMessage("The field 'conversationId' cannot be null");

        RuleFor(x => x.UserId)
            .NotNull()
            .WithMessage("The field 'userId' cannot be null");

        RuleFor(x => x)
            .MustAsync(async (command, cancellationToken) => 
            {
                var ( conversationId, userId ) = command;

                return await dbContext.Participants
                    .AnyAsync(x => x.UserId == userId && x.ConversationId == conversationId, cancellationToken);
            })
            .WithMessage("The participation was not found");
    }
}
