namespace ProxyMity.Presentation.WebSocket.Hubs.Payloads;

public record ChatSendReadMessagePayload(
    Guid ConversationId,
    Boolean IsConversationGroup,
    Guid UserId
);
