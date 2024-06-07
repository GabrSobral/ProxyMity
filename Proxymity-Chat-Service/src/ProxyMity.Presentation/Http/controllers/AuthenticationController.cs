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
    ///        "paswword": "MyStr0ngP4ssw0rd"
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
    ///        "name": "John Doe",
    ///        "email": "example@email.com",
    ///        "paswword": "MyStr0ngP4ssw0rd"
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

        return CreatedAtAction(
            nameof(UserController.GetUserById),
            routeValues: new { id = response.User.Id },
            value: response
        );
    }
}
