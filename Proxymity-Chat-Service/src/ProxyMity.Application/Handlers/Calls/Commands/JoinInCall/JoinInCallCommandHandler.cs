using ProxyMity.Application.Handlers.Calls.Commands.CreateCall;

namespace ProxyMity.Application.Handlers.Calls.Commands.JoinInCall;

public sealed class JoinInCallCommandHandler(
    ILogger<JoinInCallCommandHandler> logger,
    DataContext dbContext
) : ICommandHandler<JoinInCallCommand, CreateCallResponse>
{
    public async Task<CreateCallResponse> Handle(JoinInCallCommand request, CancellationToken cancellationToken)
    {
        request.Deconstruct(out Ulid userId, out Ulid callId);

        var call = await dbContext.Calls
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == callId && x.State == ECallStates.OCURRING, cancellationToken)
        ?? throw new Exception("The specified call does not exist or is already ended.");

        CallSession callSession = CallSession.Create(userId, callId);

        await dbContext.CallSessions.AddAsync(callSession, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation($"User joined in call. Call: {callId}; User: {userId}");

        return new CreateCallResponse(
            Id: call.Id,
            ConversationId: call.ConversationId,
            CreatedBy: call.CreatedBy,
            CreatedAt: call.CreatedAt,
            CallState: call.State
        );
    }
}
