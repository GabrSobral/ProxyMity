namespace ProxyMity.Presentation.WebSocket.Hubs.Contracts;

public interface IChatHubClient
{
    Task OnSendMessage(ChatSendMessagePayload payload);
    Task OnSendReadMessage(ChatSendReadMessagePayload payload);
    Task OnSendReceiveMessage(ChatSendReceiveMessagePayload payload);
    Task OnSendTyping(ChatSendTypingPayload payload);
}
