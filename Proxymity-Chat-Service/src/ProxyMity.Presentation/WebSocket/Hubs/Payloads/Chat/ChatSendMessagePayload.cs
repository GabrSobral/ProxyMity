namespace ProxyMity.Presentation.WebSocket.Hubs.Payloads.Chat;

public record ChatSendMessagePayload(
    Message Message,
    bool IsConversationGroup
);
