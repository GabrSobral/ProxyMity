namespace ProxyMity.Presentation.WebSocket.Hubs;

public partial class ChatHub
{
    /// <summary>
    /// 
    /// </summary>
    /// <param name="payload"></param>
    public async Task OnExitCall(CallExitCallPayload payload)
    {
        payload.Deconstruct(out Ulid callId);
        var userId = Ulid.Parse(Context.UserIdentifier ?? "");

        await Clients
            .OthersInGroup(callId.ToString())
            .ReceiveUserCallDisconnected(userId);
    }
}
