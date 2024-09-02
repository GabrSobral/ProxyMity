namespace ProxyMity.Presentation.Http.controllers;

[Authorize]
[ApiController]
[Route("calls")]
public sealed class CallController(ISender sender, IHttpContextAccessor httpContextAccessor) : ControllerBase
{
    /// <summary>
    /// Create a call on a conversation
    /// </summary>
    /// <param name="request">Request body</param>
    /// <returns>The created call</returns>
    /// <response code="200">Returns the created call</response>
    /// <response code="400">If a call is already ocurring on the conversation</response>
    /// <response code="404">If the conversation was not found</response>
    /// <response code="500">Internal server error</response>
    [HttpPost()]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<GetStatusFromMessageResponse>))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> CreateCall(CreateCallRequest request)
    {
        CreateCallCommand command = new(request.ConversationId, HttpUserClaims.GetId(httpContextAccessor?.HttpContext));
        var response = await sender.Send(command);

        return Ok(response);
    }
}
