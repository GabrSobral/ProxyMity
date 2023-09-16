namespace ProxyMity.Server;

[ApiVersion("1.0")]
[ApiController]
[Route("v{version:apiVersion}/user")]
public class UserController : ControllerBase
{
    private readonly UserService _userService;

    public UserController(UserService userService)
        => _userService = userService;

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserById(Guid id)
        => Ok(await _userService.GetByIdAsync(id));

    [HttpGet("{email}")]
    public async Task<IActionResult> GetUserByEmail(string email)
        => Ok(await _userService.GetByEmailAsync(email));
}
