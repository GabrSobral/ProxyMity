using ProxyMity.Application.Handlers.Calls.Commands.CreateCall;

namespace ProxyMity.Application.Handlers.Calls.Commands.JoinInCall;

public record JoinInCallCommand(
    Ulid CallId,
    Ulid UserId
): ICommand<CreateCallResponse>;

public record JoinInCallRequest(
    Ulid CallId
);

