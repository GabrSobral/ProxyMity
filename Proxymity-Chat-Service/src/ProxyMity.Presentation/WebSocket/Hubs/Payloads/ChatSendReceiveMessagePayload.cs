namespace ProxyMity.Presentation.WebSocket.Hubs.Payloads;

public record ChatSendReceiveMessagePayload(
    Ulid ConversationId,
    Ulid UserId,
    Ulid MessageId,
    Boolean IsConversationGroup
);
