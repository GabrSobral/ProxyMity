namespace ProxyMity.Presentation;

[Authorize]
[ApiController]
[Route("friendships")]
public class FriendshipController(ISender sender, HttpContext httpContext) : ControllerBase
{
    /// <summary>
    /// Create a friendship invite
    /// </summary>
    /// <param name="requesterId">Requester Id</param>
    /// <param name="targetId">target Id</param>
    /// <returns>The message statuses</returns>
    /// <response code="201"></response>
    /// <response code="400">If the route params are null</response>
    /// <response code="500">Internal server error</response>
    [HttpPost("{requesterId}/{targetId}")]
    [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(IEnumerable<GetStatusFromMessageResponse>))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> CreateFriendshipInvite(
        [FromRoute] Ulid requesterId, 
        [FromRoute] Ulid targetId)
    {
        CreateFriendshipInviteCommand command = new(requesterId, targetId);
        var response = await sender.Send(command);

        return CreatedAtAction(
            nameof(GetFriendshipById),
            new { requesterId = response.RequesterId, targetId = response.TargetId },
            value: response
        );
    }
    
    /// <summary>
    /// Accept the friendship invite
    /// </summary>
    /// <param name="requesterId">Requester Id</param>
    /// <returns>The message statuses</returns>
    /// <response code="200"></response>
    /// <response code="400">If the route params are null</response>
    /// <response code="404">If the friendship was not found</response>
    /// <response code="500">Internal server error</response>
    [HttpPatch("accept/{requesterId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> AcceptFriendshipInvite([FromRoute] Ulid requesterId)
    {
        var currentUserId = HttpUserClaims.GetId(httpContext);
        AcceptFriendshipInviteCommand command = new(currentUserId, requesterId);
        
        await sender.Send(command);

        return NoContent();
    }
    
    /// <summary>
    /// Deny the friendship invite
    /// </summary>
    /// <param name="requesterId">Requester Id</param>
    /// <returns>The message statuses</returns>
    /// <response code="200"></response>
    /// <response code="400">If the route params are null</response>
    /// <response code="404">If the friendship was not found</response>
    /// <response code="500">Internal server error</response>
    [HttpPatch("deny/{requesterId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DenyFriendshipInvite([FromRoute] Ulid requesterId)
    {
        var currentUserId = HttpUserClaims.GetId(httpContext);
        DenyFriendshipInviteCommand command = new(currentUserId, requesterId);
        
        await sender.Send(command);

        return NoContent();
    }

    /// <summary>
    /// Get the friendship instance
    /// </summary>
    /// <param name="requesterId">Requester Id</param>
    /// <param name="targetId">Target Id</param>
    /// <returns>The message statuses</returns>
    /// <response code="200">Returns the friendship searched</response>
    /// <response code="400">If the route params are null</response>
    /// <response code="404">If the friendship was not found</response>
    /// <response code="500">Internal server error</response>
    [HttpGet("{requesterId}/{targetId}")]   
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Friendship))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
     public async Task<IActionResult> GetFriendshipById(
        [FromRoute] Ulid requesterId, 
        [FromRoute] Ulid targetId) 
    {
        GetFriendshipByIdQuery query = new(RequesterId: requesterId, TargetId: targetId);
        var response = await sender.Send(query);

        if(response == null)
            return NotFound();

        return Ok(response);
    }
}
