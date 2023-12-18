 namespace ProxyMity.Presentation.Http.Endpoints;

public static class AuthenticationEndpoints
{
    public static void MapAuthenticationEndPoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("auth");

        group.MapPost("sign-in", SignIn).WithName(nameof(SignIn));
        group.MapPost("sign-up", SignUp).WithName(nameof(SignUp));
    }

    public static async Task<IResult> SignIn(SignInCommand model, ISender sender)
    {
        var response = await sender.Send(model);
        return TypedResults.Ok(response);
    }

    public static async Task<IResult> SignUp(SignUpCommand model, ISender sender)
    {
        var response = await sender.Send(model);
        return TypedResults.Created("", response);
    }
}