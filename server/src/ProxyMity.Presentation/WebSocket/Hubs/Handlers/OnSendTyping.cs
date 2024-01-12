namespace ProxyMity.Presentation.WebSocket.Hubs;

public partial class ChatHub
{
   /// <summary>
    /// WS Handler responsible to reecive the typing status, and propagate to another clients in group.
    /// </summary>
    /// <param name="payload">Typing status, and data to identify the conversation.</param>
    public async Task OnSendTyping(ChatSendTypingPayload payload)
    {
        var hubGroupId = payload.ConversationId.ToString();
        logger.LogInformation($"OnSendTyping: {payload.Typing}, {hubGroupId}, {payload.AuthorId}");

        await Clients.OthersInGroup(hubGroupId).ReceiveTyping(payload.Typing, payload.AuthorId, payload.ConversationId);
    }
}
