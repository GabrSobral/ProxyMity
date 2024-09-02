namespace ProxyMity.Presentation.WebSocket.Hubs;

public partial class ChatHub
{
    /// <summary>
    /// 
    /// </summary>
    /// <param name="payload"></param>
    public async Task OnJoinCall(CallJoinCallPayload payload)
    {
        payload.Deconstruct(out Ulid callId);
        var userId = Ulid.Parse(Context.UserIdentifier ?? "");

        await Clients
            .OthersInGroup(callId.ToString())
            .ReceiveUserCallConnected(userId);
    }
}
