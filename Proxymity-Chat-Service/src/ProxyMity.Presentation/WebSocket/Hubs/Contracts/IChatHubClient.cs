namespace ProxyMity.Presentation.WebSocket.Hubs.Contracts;

/// <summary>
/// Events that the clients will send to the server
/// </summary>
public interface IChatHubClient
{
    Task OnSendMessage(ChatSendMessagePayload payload);
    Task OnSendReadMessage(ChatSendReadMessagePayload payload);
    Task OnSendReceiveMessage(ChatSendReceiveMessagePayload payload);
    Task OnSendTyping(ChatSendTypingPayload payload);

    Task OnCallChat(CallJoinCallPayload payload);
    Task OnJoinCall(CallJoinCallPayload payload);
    Task OnExitCall(CallExitCallPayload payload);
}
