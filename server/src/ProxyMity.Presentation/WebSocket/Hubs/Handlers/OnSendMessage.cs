namespace ProxyMity.Presentation.WebSocket.Hubs;

public partial class ChatHub
{
    /// <summary>
    /// WS Handler responsible to receive a client message, save at database, update the status to SENT, and redirect to destiny client.
    /// </summary>
    /// <param name="payload">Message that must be send to other clients</param>
    public async Task OnSendMessage(ChatSendMessagePayload payload)
    {
        var message = payload.Message;
        var hubGroupId = message.ConversationId.ToString();
        var userId = Ulid.Parse(Context.UserIdentifier ?? "");

        SaveMessageCommand saveMessageCommand = new(message);
        await sender.Send(saveMessageCommand);

        await Clients
            .OthersInGroup(hubGroupId)
            .ReceiveMessage(message);

        await Clients
            .OthersInGroup(hubGroupId)
            .ReceiveTyping(
                isTyping:false, 
                authorId: message.AuthorId, 
                conversationId: message.ConversationId
            );

        UpdateMessageStatusCommand updateMessageStatusCommand = new (
            MessageId: message.Id,
            IsConversationGroup: payload.IsConversationGroup, 
            ConversationId: message.ConversationId, 
            Status: EMessageStatuses.SENT, 
            UserId: message.AuthorId
        );

        await sender.Send(updateMessageStatusCommand);

        await Clients
            .Clients(Context.ConnectionId)
            .ReceiveMessageStatus(
                messageStatus: EMessageStatuses.SENT, 
                messageId: message.Id, 
                conversationId: message.ConversationId, 
                userId: userId
        );
    }
}
