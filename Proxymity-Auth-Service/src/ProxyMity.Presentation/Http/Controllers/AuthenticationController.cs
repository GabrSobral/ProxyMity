using ProxyMity.Application.Handlers.Authentication.ConfirmEmail;

namespace ProxyMity.Presentation;

[ApiController]
[Route("auth")]
public class AuthenticationController(ISender sender) : ControllerBase
{
    /// <summary>
    /// Authenticate the user
    /// </summary>
    /// <param name="model">The request body</param>
    /// <returns>User data, with a JWT generated</returns>
    /// <remarks>
    /// Sample request:
    ///
    ///     POST /auth/sign-in
    ///     {
    ///        "email": "example@email.com",
    ///        "password": "MyStr0ngP4ssw0rd"
    ///     }
    ///
    /// </remarks>
    /// <response code="200">Returns the newly created item</response>
    /// <response code="400">If the item is null</response>
    /// <response code="500">Internal server error</response>
    [HttpPost("sign-in")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(SignInResponse))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> SignIn(SignInCommand model) {
        var response = await sender.Send(model);

        return Ok(response);
    }

    /// <summary>
    /// Register a new user
    /// </summary>
    /// <param name="model">The request body</param>
    /// <returns>User data, with a JWT generated</returns>
    /// <remarks>
    /// Sample request:
    ///
    ///     POST /auth/sign-up
    ///     {
    ///        "firstName": "John",
    ///        "lastName": "Doe",
    ///        "email": "example@email.com",
    ///        "password": "MyStr0ngP4ssw0rd"
    ///     }
    ///
    /// </remarks>
    /// <response code="201">Returns the newly created item</response>
    /// <response code="400">If the item is null</response>
    /// <response code="500">Internal server error</response>
    [HttpPost("sign-up")]
    [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(SignInResponse))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> SignUp(SignUpCommand model) {
        var response = await sender.Send(model);

        return CreatedAtRoute(
            nameof(UserController.GetUserById),
            routeValues: new { userId = response.User.Id },
            value: response
        );
    }

    /// <summary>
    /// Refresh the access token
    /// </summary>
    /// <param name="model">The request body</param>
    /// <returns>The generated access token</returns>
    /// <remarks>
    /// Sample request:
    ///
    ///     POST /auth/refresh-token
    ///     {
    ///        "userId": "01J0CWCTP98NF7P18VHQE89MMC",
    ///        "refreshToken": "example@email.com",
    ///        "password": "MyStr0ngP4ssw0rd"
    ///     }
    ///
    /// </remarks>
    /// <response code="201">Returns the newly created item</response>
    /// <response code="400">If the item is null</response>
    /// <response code="500">Internal server error</response>
    [HttpPost("refresh-token")]
    [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(RevokeAccessTokenResponse))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> RevokeRefreshToken([FromBody] RevokeAccessTokenCommand model)
    {
        var response = await sender.Send(model);

        return Created("", response);
    }

    /// <summary>
    /// Confirm the user e-mail address
    /// </summary>
    /// <param name="model">The request body</param>
    /// <returns>User data, with a JWT generated</returns>
    /// <remarks>
    /// Sample request:
    ///
    ///     POST /auth/confirm-email
    ///     {
    ///        "token": "30b572e9-e546-486b-924b-e8df85b5ae3c"
    ///     }
    ///
    /// </remarks>
    /// <response code="204"></response>
    /// <response code="400">If the request body is invalid</response>
    /// <response code="500">Internal server error</response>
    [HttpPost("confirm-email")]
    [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(RevokeAccessTokenResponse))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> ConfirmUserEmail([FromBody] ConfirmEmailCommand model)
    {
        await sender.Send(model);

        return NoContent();
    }
}
