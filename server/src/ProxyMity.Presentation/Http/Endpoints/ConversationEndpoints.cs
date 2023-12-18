namespace ProxyMity.Presentation.Http.Endpoints;

public static class ConversationEndpoints
{
    public static void MapConversationEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("conversation").RequireAuthorization();

        group.MapGet("get-by-user/{userId}", GetUserConversations).WithName(nameof(GetUserConversations));
        group.MapPost("private", CreatePrivateConversation).WithName(nameof(CreatePrivateConversation));
        group.MapPost("group", CreateGroupConversation).WithName(nameof(CreateGroupConversation));
    }

    public static async Task<IResult> GetUserConversations(Guid userId, ISender sender)
    {
        var query = new GetUserConversationsQuery(userId);
        var response = await sender.Send(query);

        return TypedResults.Ok(response);
    }

    public static async Task<IResult> CreatePrivateConversation(
        CreatePrivateConversationRequest model,
        HttpContext httpContext,
        ISender sender)
    {
        var userId = HttpUserClaims.GetId(httpContext);
        var command = new CreatePrivateConversationCommand(userId, model.ParticipantId);

        var response = await sender.Send(command);

        return TypedResults.Created("", response);
    }

    public static async Task<IResult> CreateGroupConversation(
        CreateGroupConversationRequest model,
        HttpContext httpContext,
        ISender sender)
    {
        var userId = HttpUserClaims.GetId(httpContext);
        var command = new CreateGroupConversationCommand(
            Name: model.Name,
            Description: model.Description,
            CreatorId: userId,
            Participants: model.Participants);

        var response = await sender.Send(command);

        return TypedResults.Created("", response);
    }
}
