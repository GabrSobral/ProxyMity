namespace ProxyMity.Presentation.WebSocket.Hubs.Payloads.Chat;

public record ChatSendTypingPayload(
    bool Typing,
    Ulid ConversationId,
    Ulid AuthorId
);
