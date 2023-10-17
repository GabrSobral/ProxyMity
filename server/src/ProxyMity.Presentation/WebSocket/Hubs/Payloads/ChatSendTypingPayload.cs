namespace ProxyMity.Presentation.WebSocket.Hubs.Payloads;

public record ChatSendTypingPayload(
    Boolean Typing,
    Guid ConversationId,
    Guid AuthorId
);
