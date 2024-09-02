using SignalRSwaggerGen.Attributes;

namespace ProxyMity.Presentation.WebSocket.Hubs.Contracts;

/// <summary>
/// Events that the server will send to the clients
/// </summary>
[SignalRHub]
public interface IChatHubServer
{
    Task ReceiveMessage(Message message);
    Task ReceivePendingMessages(Ulid userId);
    Task ReceiveTyping(bool isTyping, Ulid authorId, Ulid conversationId);
    Task ReceiveMessageStatus(EMessageStatuses messageStatus, Ulid messageId, Ulid conversationId, Ulid userId, bool appliedForAll);
    Task ReceiveReadMessage(Ulid conversationId, Ulid userId, bool isConversationGroup, bool readByAll);


    Task ReceiveUserCallConnected(Ulid userId);
    Task ReceiveChatCall(Ulid chatId, Ulid userId);
    Task ReceiveUserCallDisconnected(Ulid userId);
}
