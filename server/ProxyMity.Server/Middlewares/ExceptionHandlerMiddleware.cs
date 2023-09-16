namespace ProxyMity.Server.Middlewares;

public class ExceptionHandlerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlerMiddleware> _logger;

    public ExceptionHandlerMiddleware(RequestDelegate next, ILogger<ExceptionHandlerMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception error)
        {
            _logger.LogError(error, error.Message);

            var response = context.Response;
            response.ContentType = "application/json";

            SwitchException(error, response);

            var result = JsonSerializer.Serialize(new
            {
                type = error.GetType().ToString(),
                title = error.GetType().Name,
                status = response.StatusCode,
                error = error.Message,
                occuredAt = DateTime.UtcNow
            });

            await response.WriteAsync(result);
        }
    }

    private void SwitchException(Exception error, HttpResponse response)
    {
        switch (error)
        {
            case NoJwtSecretWasProvidedException:
                response.StatusCode = (int)HttpStatusCode.InternalServerError;
                _logger.LogError($"[No Jwt Secret as provided] {error.Message}");
                break;

            case EmailOrPasswordInvalidException:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                _logger.LogError($"[Email or password invalid request] {error.Message}");
                break;

            case UserNotFoundException:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                _logger.LogError($"[User not found request] {error.Message}");
                break;

            case UserAlreadyExistException:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                _logger.LogError($"[User already exist request] {error.Message}");
                break;

            default:
                response.StatusCode = (int)HttpStatusCode.InternalServerError;
                _logger.LogError($"[Internal error request] {error.Message}");
                break;
        }
    }
}
