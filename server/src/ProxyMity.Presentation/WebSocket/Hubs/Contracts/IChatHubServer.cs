using SignalRSwaggerGen.Attributes;

namespace ProxyMity.Presentation.WebSocket.Hubs.Contracts;

[SignalRHub]
public interface IChatHubServer
{
    Task ReceiveMessage(Message message);
    Task ReceivePendingMessages(Ulid userId);
    Task ReceiveTyping(bool isTyping, Ulid authorId, Ulid conversationId);
    Task ReceiveMessageStatus(EMessageStatuses messageStatus, Ulid messageId, Ulid conversationId, Ulid userId);
    Task ReceiveReadMessage(Ulid conversationId, Ulid userId, bool isConversationGroup);
}
