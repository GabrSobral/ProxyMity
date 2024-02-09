namespace ProxyMity.Presentation.Http.Endpoints;

public static class FriendshipEndpoints
{
    public static void MapFriendshipEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("friendship").RequireAuthorization();

        group.MapPost("{requesterId}/{targetId}", CreateFriendshipInvite).WithName(nameof(CreateFriendshipInvite));
        group.MapPatch("accept/{requesterId}", AcceptFriendshipInvite).WithName(nameof(AcceptFriendshipInvite));
        group.MapPatch("deny/{requesterId}", DenyFriendshipInvite).WithName(nameof(DenyFriendshipInvite));
    }
    
    public static async Task<IResult> CreateFriendshipInvite(Ulid requesterId, Ulid targetId, ISender sender)
    {
        CreateFriendshipInviteCommand command = new(requesterId, targetId);
        await sender.Send(command);

        return TypedResults.NoContent();
    }
    
    public static async Task<IResult> AcceptFriendshipInvite(Ulid requesterId, HttpContext httpContext, ISender sender)
    {
        var currentUserId = HttpUserClaims.GetId(httpContext);
        AcceptFriendshipInviteCommand command = new(currentUserId, requesterId);
        
        await sender.Send(command);

        return TypedResults.NoContent();
    }
    
    public static async Task<IResult> DenyFriendshipInvite(Ulid requesterId, HttpContext httpContext, ISender sender)
    {
        var currentUserId = HttpUserClaims.GetId(httpContext);
        DenyFriendshipInviteCommand command = new(currentUserId, requesterId);
        
        await sender.Send(command);

        return TypedResults.NoContent();
    }
}