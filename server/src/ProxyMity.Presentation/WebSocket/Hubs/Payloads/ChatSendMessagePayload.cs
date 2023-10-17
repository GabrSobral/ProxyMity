namespace ProxyMity.Presentation.WebSocket.Hubs.Payloads;

public record ChatSendMessagePayload(
    Message Message,
    bool IsConversationGroup
);
