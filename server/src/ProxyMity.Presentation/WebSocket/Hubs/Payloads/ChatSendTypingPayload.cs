namespace ProxyMity.Presentation.WebSocket.Hubs.Payloads;

public record ChatSendTypingPayload(
    bool Typing,
    Ulid ConversationId,
    Ulid AuthorId
);
