namespace ProxyMity.Server.Controllers;

[ApiVersion("1.0")]
[ApiController]
[Route("v{version:apiVersion}/auth")]
public class AuthenticationController : ControllerBase
{
    private readonly AuthenticateService _authenticateService;

    public AuthenticationController(AuthenticateService authenticateService)
        => _authenticateService = authenticateService;

    [HttpPost("sign-in")]
    public async Task<IActionResult> SignIn(SignInInputModel model)
        => Ok(await _authenticateService.SignInAsync(model));

    [HttpPost("sign-up")]
    public async Task<IActionResult> SignUp(SignUpInputModel model)
        => Ok(await _authenticateService.SignUpAsync(model));
}