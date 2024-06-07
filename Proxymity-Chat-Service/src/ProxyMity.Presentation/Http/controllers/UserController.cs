namespace ProxyMity.Presentation;

[Authorize]
[ApiController]
[Route("users")]
public class UserController(ISender sender) : ControllerBase
{
    /// <summary>
    /// Search an user by Id.
    /// </summary>
    /// <param name="userId">User Id</param>
    /// <response code="200">Returns the user searched</response>
    /// <response code="400">If the "Id" is null</response>
    /// <response code="404">If the user was not found</response>
    /// <response code="500">Internal server error</response>
    [HttpGet("get-by-id/{userId}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetByIdResponse))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetUserById([FromRoute] Ulid userId)
    {
        var query = new GetByIdQuery(userId);
        var response = await sender.Send(query);

        if(response == null) 
            return NotFound();

        return Ok(response);
    }

    /// <summary>
    /// Search an user by e-mail.
    /// </summary>
    /// <param name="email">User email</param>
    /// <response code="200">Returns the user searched</response>
    /// <response code="400">If the "email" is null</response>
    /// <response code="404">If the user was not found</response>
    /// <response code="500">Internal server error</response>
    [HttpGet("get-by-email/{email}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetByEmailResponse))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetUserByEmail(string email)
    {
        var query = new GetByEmailQuery(email);
        var response = await sender.Send(query);

        if(response == null) 
            return NotFound();

        return Ok(response);
    }
}
