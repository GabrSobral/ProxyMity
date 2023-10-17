namespace ProxyMity.Presentation.Http.Endpoints;

/// <summary>
/// User endpoints handler.
/// </summary>
public static class UserEndpoints
{
    /// <summary>
    /// Static method to map and register the user endpoints.
    /// </summary>
    /// <param name="app">Endpoint router builder, provided by Minimal APIs</param>
    public static void MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("user").RequireAuthorization();

        group.MapGet("get-by-id/{userId}", GetUserById).WithName(nameof(GetUserById));

        group.MapGet("get-by-email/{email}", GetUserByEmail).WithName(nameof(GetUserByEmail));
    }

    /// <summary>
    ///  Endpoint which is responsible searching an user by Id.
    /// </summary>
    /// <param name="userId">User Id</param>
    /// <param name="sender">MediatR sender</param>
    public static async Task<IResult> GetUserById(Guid userId, ISender sender)
    {
        var query = new GetByIdQuery(userId);

        var response = await sender.Send(query);

        return TypedResults.Ok(response);
    }

    /// <summary>
    /// Endpoint which is responsible searching an user by email.
    /// </summary>
    /// <param name="email">User email</param>
    /// <param name="sender">MediatR sender</param>
    public static async Task<IResult> GetUserByEmail(string email, ISender sender)
    {
        var query = new GetByEmailQuery(email);

        await sender.Send(query);

        return TypedResults.Ok();
    }
}
