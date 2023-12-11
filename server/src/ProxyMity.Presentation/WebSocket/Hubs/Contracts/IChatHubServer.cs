using SignalRSwaggerGen.Attributes;

namespace ProxyMity.Presentation.WebSocket.Hubs.Contracts;

[SignalRHub]
public interface IChatHubServer
{
    Task ReceiveMessage(Message message);
    Task ReceiveTyping(bool isTyping, Guid authorId, Guid conversationId);
    Task ReceiveMessageStatus(EMessageStatuses messageStatus, Guid messageId, Guid conversationId);
    Task ReceiveReadMessage(Guid conversationId, Guid userId);
}
