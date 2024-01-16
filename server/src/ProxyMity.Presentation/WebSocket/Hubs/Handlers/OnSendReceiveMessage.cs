namespace ProxyMity.Presentation.WebSocket.Hubs;

public partial class ChatHub
{
    /// <summary>
    /// 
    /// </summary>
    /// <param name="payload"></param>
    public async Task OnSendReceiveMessage(ChatSendReceiveMessagePayload payload)
    {
        var hubGroupId = payload.ConversationId.ToString();
        var userId = Ulid.Parse(Context.UserIdentifier ?? "");

        var updateMessageStatusCommand = new UpdateMessageStatusCommand(
            payload.MessageId, payload.IsConversationGroup, payload.ConversationId, EMessageStatuses.RECEIVED, payload.UserId);

        await sender.Send(updateMessageStatusCommand);

        await Clients.OthersInGroup(hubGroupId).ReceiveMessageStatus(EMessageStatuses.RECEIVED, payload.MessageId, payload.ConversationId, userId);
    }
}
