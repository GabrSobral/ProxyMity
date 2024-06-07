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
        ReadConversationMessagesCommand readConversationMessagesCommand = new (
            UserId: payload.UserId, 
            ConversationId: payload.ConversationId, 
            IsConversationGroup: payload.IsConversationGroup
        );
        
        var hubGroupId = payload.ConversationId.ToString();

        await Clients
            .OthersInGroup(hubGroupId)
            .ReceiveReadMessage(
                conversationId: payload.ConversationId, 
                userId: payload.UserId, 
                isConversationGroup: payload.IsConversationGroup,
                readByAll: await sender.Send(readConversationMessagesCommand)
            );
    }
}
