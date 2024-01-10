namespace ProxyMity.Presentation.Http.Endpoints;

public static class MessageEndpoints
{
    public static void MapMessageEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("message").RequireAuthorization();

        group.MapGet("status/{conversationId}/{messageId}", GetStatusFromMessage).WithName(nameof(GetStatusFromMessage));
    }

    public static async Task<IResult> GetStatusFromMessage(Ulid conversationId, Ulid messageId, ISender sender)
    {
        GetStatusFromMessageQuery query = new(messageId, conversationId);
        var response = await sender.Send(query);

        return TypedResults.Ok(response);
    }
}
