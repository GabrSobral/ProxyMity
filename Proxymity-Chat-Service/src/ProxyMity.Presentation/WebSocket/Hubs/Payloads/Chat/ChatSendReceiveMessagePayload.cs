namespace ProxyMity.Presentation.WebSocket.Hubs.Payloads.Chat;

public record ChatSendReceiveMessagePayload(
    Ulid ConversationId,
    Ulid UserId,
    Ulid MessageId,
    bool IsConversationGroup
);
