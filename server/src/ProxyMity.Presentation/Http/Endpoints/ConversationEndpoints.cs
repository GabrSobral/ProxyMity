namespace ProxyMity.Presentation.Http.Endpoints;

public static class ConversationEndpoints
{
    public static void MapConversationEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("conversation").RequireAuthorization();

        group.MapPost("group", CreateGroupConversation).WithName(nameof(CreateGroupConversation));
        group.MapPost("private", CreatePrivateConversation).WithName(nameof(CreatePrivateConversation));

        group.MapGet("get-by-user/{userId}", GetUserConversations).WithName(nameof(GetUserConversations));
        group.MapGet("messages/{conversationId}", GetConversationMessages).WithName(nameof(GetConversationMessages));
    }

    public static async Task<IResult> GetConversationMessages(Ulid conversationId, ISender sender)
    {
        GetConversationMessagesQuery query = new(conversationId);
        var response = await sender.Send(query);

        return TypedResults.Ok(response);
    }

    public static async Task<IResult> GetUserConversations(Ulid userId, ISender sender)
    {
        GetUserConversationsQuery query = new(userId);
        var response = await sender.Send(query);

        return TypedResults.Ok(response);
    }

    public static async Task<IResult> CreatePrivateConversation(
        CreatePrivateConversationRequest model,
        HttpContext httpContext,
        ISender sender)
    {
        CreatePrivateConversationCommand command = new (
            RequesterId: HttpUserClaims.GetId(httpContext), 
            ParticipantId: model.ParticipantId
        );

        var response = await sender.Send(command);

        return TypedResults.Created("", response);
    }

    public static async Task<IResult> CreateGroupConversation(
        CreateGroupConversationRequest model,
        HttpContext httpContext,
        ISender sender)
    {
        CreateGroupConversationCommand command = new(
            Name: model.Name,
            Description: model.Description,
            CreatorId: HttpUserClaims.GetId(httpContext),
            Participants: model.Participants);

        var response = await sender.Send(command);

        return TypedResults.Created("", response);
    }
}
