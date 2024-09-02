namespace ProxyMity.Application.Handlers.Calls.Commands.CreateCall;

public sealed class CreateCallCommandHandler(
    ILogger<CreateCallCommandHandler> logger,
    DataContext dbContext
) : ICommandHandler<CreateCallCommand, CreateCallResponse>
{
    public async Task<CreateCallResponse> Handle(CreateCallCommand command, CancellationToken cancellationToken)
    {
        var ocurringCall = await dbContext.Calls
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == command.ConversationId && x.State == ECallStates.OCURRING, cancellationToken);

        if (ocurringCall is not null) 
            throw new Exception($"Already have a call ocurring right now on this conversation, just enter on it: {ocurringCall.Id}");

        Call createdCall = Call.Create(command.ConversationId, command.CreatedBy);
        CallSession callSessionCurrentUser = CallSession.Create(command.CreatedBy, createdCall.Id);

        await dbContext.Calls.AddAsync(createdCall, cancellationToken);
        await dbContext.CallSessions.AddAsync(callSessionCurrentUser, cancellationToken);

        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation($"A new call was successfully created on '{command.ConversationId}' conversation. CallId: {createdCall.Id}");

        return new CreateCallResponse(
            Id: createdCall.Id,
            ConversationId: createdCall.ConversationId,
            CreatedBy: createdCall.CreatedBy,
            CreatedAt: createdCall.CreatedAt,
            CallState: createdCall.State
        );
    }
}
