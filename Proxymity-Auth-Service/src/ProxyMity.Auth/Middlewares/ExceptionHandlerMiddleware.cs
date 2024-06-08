namespace ProxyMity.Auth.Middlewares;

public sealed class ExceptionHandlerMiddleware(RequestDelegate next, ILogger<ExceptionHandlerMiddleware> logger)
{
    public async Task Invoke(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception error)
        {
            logger.LogError(error, error.Message);

            var response = context.Response;
            response.ContentType = "application/json";

            SwitchException(error, response);

            var result = JsonSerializer.Serialize(new
            {
                title = error.GetType().Name,
                status = response.StatusCode,
                occuredAt = DateTime.UtcNow,
                error = error.Message
            });

            await response.WriteAsync(result);
        }
    }

    private void SwitchException(Exception error, HttpResponse response)
    {
        switch (error)
        {
            case Exception:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                logger.LogError($"[Message not found] {error.Message}");
                break;

            default:
                response.StatusCode = (int)HttpStatusCode.InternalServerError;
                logger.LogError($"[Internal error request] {error.Message}");
                break;
        }
    }
}
