namespace ProxyMity.Presentation.WebSocket.Hubs.Payloads;

public record ChatSendReadMessagePayload(
    Ulid ConversationId,
    bool IsConversationGroup,
    Ulid UserId
);
