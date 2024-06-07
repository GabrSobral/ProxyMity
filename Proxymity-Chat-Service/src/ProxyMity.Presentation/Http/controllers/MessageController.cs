namespace ProxyMity.Presentation;

[Authorize]
[ApiController]
[Route("messages")]
public class MessageController(ISender sender) : ControllerBase
{
    /// <summary>
    /// Get the statuses of message
    /// </summary>
    /// <param name="conversationId"></param>
    /// <param name="messageId"></param>
    /// <returns>The message statuses</returns>
    /// <response code="200">Returns the message searched</response>
    /// <response code="400">If the "Id" is null</response>
    /// <response code="404">If the message was not found</response>
    /// <response code="500">Internal server error</response>
    [HttpGet("status/{conversationId}/{messageId}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<GetStatusFromMessageResponse>))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetStatusFromMessage(
        [FromRoute] Ulid conversationId, 
        [FromRoute] Ulid messageId)
    {
        GetStatusFromMessageQuery query = new(messageId, conversationId);
        var response = await sender.Send(query);

        if(!response.Any())
            return NotFound();

        return Ok(response);
    }

    /// <summary>
    /// Get a message by Id
    /// </summary>
    /// <param name="messageId"></param>
    /// <returns>The searched message</returns>
    /// <response code="200">Returns the message searched</response>
    /// <response code="400">If the "Id" is null</response>
    /// <response code="404">If the message was not found</response>
    /// <response code="500">Internal server error</response>
    [HttpGet("{messageId}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Message))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetMessageById([FromRoute] Ulid messageId)
    {
        GetMessageByIdQuery query = new(messageId);
        var response = await sender.Send(query);

        if(response == null)
          return NotFound();

        return Ok(response);
    }
}
