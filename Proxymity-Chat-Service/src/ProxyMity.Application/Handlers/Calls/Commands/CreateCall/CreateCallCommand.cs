namespace ProxyMity.Application.Handlers.Calls.Commands.CreateCall;

public record CreateCallCommand(
    Ulid ConversationId,
    Ulid CreatedBy
): ICommand<CreateCallResponse>;

public record CreateCallRequest(
    Ulid ConversationId   
);

public record CreateCallResponse(
    Ulid Id,
    Ulid ConversationId,
    Ulid CreatedBy,
    DateTime CreatedAt,
    ECallStates CallState
);
