namespace ProxyMity.Presentation.WebSocket.Hubs.Payloads;

public record ChatSendReceiveMessagePayload(
    Guid ConversationId,
    Guid UserId,
    Guid MessageId,
    Boolean IsConversationGroup
);
