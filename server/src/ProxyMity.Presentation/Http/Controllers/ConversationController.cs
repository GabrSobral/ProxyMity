namespace ProxyMity.Presentation.Http.Controllers;

[Authorize]
[Route("/conversation")]
[ApiController]
public sealed class ConversationController(ISender sender, HttpContext httpContext) : ControllerBase
{
    [HttpGet("get-by-user/{userId}")]
    public async Task<IActionResult> GetUserConversations(Guid userId)
    {
        var query = new GetUserConversationsQuery(userId);
        var response = await sender.Send(query);

        return Ok(response);
    }

    [HttpPost("private")]
    public async Task<IActionResult> CreatePrivateConversation([FromBody] CreatePrivateConversationRequest model)
    {
        var userId = HttpUserClaims.GetId(httpContext);
        var command = new CreatePrivateConversationCommand(userId, model.ParticipantId);

        var response = await sender.Send(command);

        return Created("", response);
    }

    [HttpPost("group")]
    public async Task<IActionResult> CreateGroupConversation([FromBody] CreateGroupConversationCommand model)
    {
        var response = await sender.Send(model);

        return Created("", response);
    }
}
