namespace ProxyMity.Presentation.Http.Endpoints;

/// <summary>
/// Conversation endpoints handler. (NEED AUTHENTICATION)
/// </summary>
public static class ConversationEndpoints
{
    /// <summary>
    /// Static method to map and register the conversation endpoints.
    /// </summary>
    /// <param name="app">Endpoint router builder, provided by Minimal APIs</param>
    public static void MapConversationEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("conversation").RequireAuthorization();

        group.MapGet("get-by-user/{userId}", GetUserConversations).WithName(nameof(GetUserConversations));

        group.MapPost("private", CreatePrivateConversation).WithName(nameof(CreatePrivateConversation));

        group.MapPost("group", CreateGroupConversation).WithName(nameof(CreateGroupConversation));
    }

    /// <summary>
    ///  Endpoint which is responsible for listing the user conversations.
    /// </summary>
    /// <param name="userId">The current user Id which you want to get all conversations</param>
    /// <param name="sender">MediatR sender</param>
    public static async Task<IResult> GetUserConversations(Guid userId, ISender sender)
    {
        var query = new GetUserConversationsQuery(userId);

        var response = await sender.Send(query);

        return TypedResults.Ok(response);
    }

    /// <summary>
    /// Endpoint which handles with a creation of a private conversation.
    /// </summary>
    /// <param name="model">Create Private Conversation CQRS command</param>
    /// <param name="httpContext">The HTTP Context of request, used to get the request user claim</param>
    /// <param name="sender">MediatR sender</param>
    public static async Task<IResult> CreatePrivateConversation(
        CreatePrivateConversationRequest model,
        HttpContext httpContext,
        ISender sender
    )
    {
        var userId = HttpUserClaims.GetId(httpContext);
        var command = new CreatePrivateConversationCommand(userId, model.ParticipantId);
        var response = await sender.Send(command);

        return TypedResults.Ok(response);
    }

    /// <summary>
    ///  Endpoint which handles with a creation of a group conversation.
    /// </summary>
    /// <param name="model">Create Group Conversation CQRS command</param>
    /// <param name="sender">MediatR sender</param>
    public static async Task<IResult> CreateGroupConversation(CreateGroupConversationCommand model, ISender sender)
    {
        var response = await sender.Send(model);

        return TypedResults.Ok(response);
    }
}
