namespace ProxyMity.Presentation;

[Authorize]
[ApiController]
[Route("conversations")]
public class ConversationController(ISender sender, IHttpContextAccessor httpContextAccessor) : ControllerBase
{
    [HttpPost("group")]
    public async Task<IActionResult> CreateGroupConversation([FromBody] CreateGroupConversationRequest model)
    {
        var command = new CreateGroupConversationCommand(
            Name: model.Name,
            Description: model.Description,
            CreatorId: HttpUserClaims.GetId(httpContextAccessor?.HttpContext),
            Participants: model.Participants.Select(Ulid.Parse)
        );

        var response = await sender.Send(command);
        
        return Created("", response);
    }

    [HttpPost("private")]
    public async Task<IActionResult> CreatePrivateConversation([FromBody] CreatePrivateConversationRequest model)
    {
        var command = new CreatePrivateConversationCommand(
            RequesterId: HttpUserClaims.GetId(httpContextAccessor?.HttpContext),
            ParticipantId: Ulid.Parse(model.ParticipantId)
        );

        var response = await sender.Send(command);
        return Created("", response);
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserConversations(Ulid userId)
    {
        var query = new GetUserConversationsQuery(userId);
        var response = await sender.Send(query);

        return Ok(response);
    }

    [HttpGet("messages/{conversationId}")]
    public async Task<IActionResult> GetConversationMessages(Ulid conversationId)
    {
        var query = new GetConversationMessagesQuery(conversationId);
        var response = await sender.Send(query);

        return Ok(response);
    }

    [HttpPatch("{conversationId}/pin")]
    public async Task<IActionResult> PinConversation(Ulid conversationId)
    {
        var command = new PinConversationCommand(
            ConversationId: conversationId,
            UserId: HttpUserClaims.GetId(httpContextAccessor?.HttpContext)
        );

        await sender.Send(command);

        return NoContent();
    }

    [HttpPatch("{conversationId}/unpin")]
    public async Task<IActionResult> UnpinConversation(Ulid conversationId)
    {
        var command = new UnpinConversationCommand(
            ConversationId: conversationId,
            UserId: HttpUserClaims.GetId(httpContextAccessor?.HttpContext)
        );

        await sender.Send(command);

        return NoContent();
    }
}
