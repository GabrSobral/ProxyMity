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
            MessageId: payload.MessageId, 
            IsConversationGroup: payload.IsConversationGroup, 
            ConversationId: payload.ConversationId,
            Status: EMessageStatuses.RECEIVED, 
            UserId: payload.UserId
        );

        await sender.Send(updateMessageStatusCommand);

        await Clients
            .OthersInGroup(hubGroupId)
            .ReceiveMessageStatus(
                messageStatus: EMessageStatuses.RECEIVED, 
                messageId: payload.MessageId, 
                conversationId: payload.ConversationId, 
                userId: userId
            );
    }
}
