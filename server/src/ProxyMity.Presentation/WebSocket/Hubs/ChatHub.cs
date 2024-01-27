namespace ProxyMity.Presentation.WebSocket.Hubs;

/// <summary>
/// Chat SignalR hub, that handle with all events of real time chat.
/// </summary>
[Authorize]
public sealed partial class ChatHub(ILogger<ChatHub> logger, ISender sender) : Hub<IChatHubServer>, IChatHubClient
{
    /// <summary>
    /// When user connect, will be assigned to all conversations that belong, at SignalR groups.
    /// </summary>
    public override async Task OnConnectedAsync()
    {
        logger.LogInformation($"The user {Context.UserIdentifier} is connected.");

        var userId = Ulid.Parse(Context.UserIdentifier ?? "");

        GetUserConversationsQuery getUserConversationsQuery = new (userId);
        var userConversations = await sender.Send(getUserConversationsQuery);

        foreach (var item in userConversations) 
        {
            string conversationId = item.Conversation.Id.ToString();
            await Groups.AddToGroupAsync(Context.ConnectionId!, conversationId);

            await Clients
                .OthersInGroup(conversationId)
                .ReceivePendingMessages(userId);
        }
    }

    /// <summary>
    /// When user disconnect, will be removed to all conversations that belong, at SignalR groups.
    /// </summary>
    /// <param name="exception"></param>
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        logger.LogInformation($"The user {Context.UserIdentifier} is disconnected.");

        var userId = Ulid.Parse(Context.UserIdentifier ?? "");
        GetUserConversationsQuery getUserConversationsQuery = new (userId);
        var userConversations = await sender.Send(getUserConversationsQuery);

        foreach (var item in userConversations)
            await Groups.RemoveFromGroupAsync(Context.UserIdentifier!, item.Conversation.Id.ToString());
    }
}
