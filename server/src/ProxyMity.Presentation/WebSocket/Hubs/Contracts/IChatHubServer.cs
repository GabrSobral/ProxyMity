using SignalRSwaggerGen.Attributes;

namespace ProxyMity.Presentation.WebSocket.Hubs.Contracts;

[SignalRHub]
public interface IChatHubServer
{
    Task ReceiveMessage(Message message);
    Task ReceiveTyping(bool isTyping, Ulid authorId, Ulid conversationId);
    Task ReceiveMessageStatus(EMessageStatuses messageStatus, Ulid messageId, Ulid conversationId);
    Task ReceiveReadMessage(Ulid conversationId, Ulid userId, bool isConversationGroup);
}
