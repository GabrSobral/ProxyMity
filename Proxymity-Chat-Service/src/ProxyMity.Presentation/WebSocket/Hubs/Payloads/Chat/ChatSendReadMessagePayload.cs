namespace ProxyMity.Presentation.WebSocket.Hubs.Payloads.Chat;

public record ChatSendReadMessagePayload(
    Ulid ConversationId,
    bool IsConversationGroup,
    Ulid UserId
);
