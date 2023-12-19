namespace ProxyMity.Presentation.WebSocket.Hubs.Payloads;

public record ChatSendTypingPayload(
    bool Typing,
    Guid ConversationId,
    Guid AuthorId
);
