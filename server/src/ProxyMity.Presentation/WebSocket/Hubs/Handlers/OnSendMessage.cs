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

        var saveMessageCommand = new SaveMessageCommand(message);
        await sender.Send(saveMessageCommand);

        await Clients.OthersInGroup(hubGroupId).ReceiveMessage(message);
        await Clients.OthersInGroup(hubGroupId).ReceiveTyping(false, message.AuthorId, message.ConversationId);

        var updateMessageStatusCommand = new UpdateMessageStatusCommand(
            message.Id, payload.IsConversationGroup, message.ConversationId, EMessageStatuses.SENT, message.AuthorId);

        await sender.Send(updateMessageStatusCommand);

        await Clients.Clients(Context.ConnectionId).ReceiveMessageStatus(EMessageStatuses.SENT, message.Id, message.ConversationId, userId);
    }
}
