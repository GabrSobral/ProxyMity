using FluentValidation;
using ProxyMity.Application.Handlers.Authentication.SignIn;
using ProxyMity.Application.Handlers.Authentication.SignUp;

namespace ProxyMity.Presentation.Http.Endpoints;

/// <summary>
/// Authentication endpoints handler.
/// </summary>
public static class AuthenticationEndpoints
{
    /// <summary>
    /// Static method to map and register the authentication endpoints.
    /// </summary>
    /// <param name="app">Endpoint router builder, provided by Minimal APIs</param>
    public static void MapAuthenticationEndPoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("auth");

        group.MapPost("sign-in", SignIn).WithName(nameof(SignIn));

        group.MapPost("sign-up", SignUp).WithName(nameof(SignUp));
    }

    /// <summary>
    /// Endpoint which handle with user authentication, passing the email and raw password as body parameter.
    /// </summary>
    /// <param name="model">Sign In CQRS command</param>
    /// <param name="sender">MediatR sender</param>
    public static async Task<IResult> SignIn(SignInCommand model, ISender sender)
    {
        var response = await sender.Send(model);
        return TypedResults.Ok(response);
    }

    /// <summary>
    /// Endpoint which handle with user registration, passing the name, email and raw password as body parameter.
    /// </summary>
    /// <param name="model">Sign Up CQRS command</param>
    /// <param name="sender">MediatR sender</param>
    public static async Task<IResult> SignUp(SignUpCommand model, ISender sender)
    {
        var response = await sender.Send(model);
        return TypedResults.Ok(response);
    }
}