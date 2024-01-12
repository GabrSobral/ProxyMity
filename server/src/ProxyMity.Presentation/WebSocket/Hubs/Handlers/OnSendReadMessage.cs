namespace ProxyMity.Presentation.WebSocket.Hubs;

public partial class ChatHub
{
   /// <summary>
    /// 
    /// </summary>
    /// <param name="payload"></param>
    /// <exception cref="NotImplementedException"></exception>
    public async Task OnSendReadMessage(ChatSendReadMessagePayload payload)
    {
        var readConversationMessagesCommand = new ReadConversationMessagesCommand(payload.UserId, payload.ConversationId, payload.IsConversationGroup);
        await sender.Send(readConversationMessagesCommand);

        var hubGroupId = payload.ConversationId.ToString();
        await Clients.OthersInGroup(hubGroupId).ReceiveReadMessage(payload.UserId, payload.ConversationId, payload.IsConversationGroup);
    }
}
