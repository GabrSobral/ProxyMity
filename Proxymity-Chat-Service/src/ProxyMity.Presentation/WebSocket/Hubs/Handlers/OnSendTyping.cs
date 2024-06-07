namespace ProxyMity.Presentation.WebSocket.Hubs;

public partial class ChatHub
{
   /// <summary>
    /// WS Handler responsible to reecive the typing status, and propagate to another clients in group.
    /// </summary>
    /// <param name="payload">Typing status, and data to identify the conversation.</param>
    public async Task OnSendTyping(ChatSendTypingPayload payload)
    {
        logger.LogInformation($"OnSendTyping: {payload.Typing}, {payload.ConversationId}, {payload.AuthorId}");

        var hubGroupId = payload.ConversationId.ToString();

        await Clients
            .OthersInGroup(hubGroupId)
            .ReceiveTyping(
                isTyping: payload.Typing, 
                authorId: payload.AuthorId, 
                conversationId: payload.ConversationId
            );
    }
}
