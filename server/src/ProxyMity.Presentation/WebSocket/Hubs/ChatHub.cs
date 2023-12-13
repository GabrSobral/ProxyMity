namespace ProxyMity.Presentation.WebSocket.Hubs;

/// <summary>
/// Chat SignalR hub, that handle with all events of real time chat.
/// </summary>
[Authorize]
public sealed class ChatHub(
    ILogger<ChatHub> logger,
    ISender sender
) : Hub<IChatHubServer>, IChatHubClient
{
    /// <summary>
    /// When user connect, will be assigned to all conversations that belong, at SignalR groups.
    /// </summary>
    public override async Task OnConnectedAsync()
    {
        logger.LogInformation($"The user {Context.UserIdentifier} is connected.");

        var userId = Guid.Parse(Context.UserIdentifier ?? "");
        var getUserConversationsQuery = new GetUserConversationsQuery(userId);
        var userConversations = await sender.Send(getUserConversationsQuery);

        foreach (var item in userConversations)
            await Groups.AddToGroupAsync(Context.UserIdentifier!, item.Conversation.Id.ToString());
    }

    /// <summary>
    /// When user disconnect, will be removed to all conversations that belong, at SignalR groups.
    /// </summary>
    /// <param name="exception"></param>
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        logger.LogInformation($"The user {Context.UserIdentifier} is disconnected.");

        var userId = Guid.Parse(Context.UserIdentifier ?? "");
        var getUserConversationsQuery = new GetUserConversationsQuery(userId);
        var userConversations = await sender.Send(getUserConversationsQuery);

        foreach (var item in userConversations)
            await Groups.RemoveFromGroupAsync(Context.UserIdentifier!, item.Conversation.Id.ToString());
    }

    /// <summary>
    /// WS Handler responsible to receive a client message, save at database, update the status to SENT, and redirect to destiny client.
    /// </summary>
    /// <param name="payload">Message that must be send to other clients</param>
    public async Task OnSendMessage(ChatSendMessagePayload payload)
    {
        var message = payload.Message;
        var hubGroupId = message.ConversationId.ToString();

        var saveMessageCommand = new SaveMessageCommand(message);
        await sender.Send(saveMessageCommand);

        await Clients.OthersInGroup(hubGroupId).ReceiveMessage(message);
        await Clients.OthersInGroup(hubGroupId).ReceiveTyping(false, message.AuthorId, message.ConversationId);

        var updateMessageStatusCommand = new UpdateMessageStatusCommand(
            message.Id, payload.IsConversationGroup, message.ConversationId, EMessageStatuses.SENT, message.AuthorId);

        await sender.Send(updateMessageStatusCommand);

        await Clients.Clients(Context.ConnectionId).ReceiveMessageStatus(EMessageStatuses.SENT, message.Id, message.ConversationId);
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="payload"></param>
    /// <exception cref="NotImplementedException"></exception>
    public async Task OnSendReadMessage(ChatSendReadMessagePayload payload)
    {
        var readConversationMessagesCommand = new ReadConversationMessagesCommand(payload.UserId, payload.ConversationId, payload.IsConversationGroup);
        await sender.Send(readConversationMessagesCommand);

        var hubGroupId = payload.ConversationId.ToString();
        await Clients.OthersInGroup(hubGroupId).ReceiveReadMessage(payload.UserId, payload.ConversationId);
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="payload"></param>
    public async Task OnSendReceiveMessage(ChatSendReceiveMessagePayload payload)
    {
        var hubGroupId = payload.ConversationId.ToString();
        var updateMessageStatusCommand = new UpdateMessageStatusCommand(
            payload.MessageId, payload.IsConversationGroup, payload.ConversationId, EMessageStatuses.SENT, payload.UserId);

        await sender.Send(updateMessageStatusCommand);

        await Clients.OthersInGroup(hubGroupId).ReceiveMessageStatus(EMessageStatuses.RECEIVED, payload.MessageId, payload.ConversationId);
    }

    /// <summary>
    /// WS Handler responsible to reecive the typing status, and propagate to another clients in group.
    /// </summary>
    /// <param name="payload">Typing status, and data to identify the conversation.</param>
    public async Task OnSendTyping(ChatSendTypingPayload payload)
    {
        logger.LogInformation($"OnSendTyping: {payload.Typing}, ");
        var hubGroupId = payload.ConversationId.ToString();

        await Clients.OthersInGroup(hubGroupId)
            .ReceiveTyping(payload.Typing, payload.AuthorId, payload.ConversationId);
    }
}
