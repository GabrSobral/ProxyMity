using ProxyMity.Infra.Messaging.Core.Exceptions;

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
            case MessagingServiceConnectionException:
                response.StatusCode = (int)HttpStatusCode.InternalServerError;
                logger.LogError($"[Messaging service error] {error.Message}");
                break;

            case UserNotFoundException:
                response.StatusCode = (int)HttpStatusCode.NotFound;
                logger.LogError($"[User not found] {error.Message}");
                break;

            case UserAlreadyExistException:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                logger.LogError($"[User already exist] {error.Message}");
                break;

            case UserNotActiveException:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                logger.LogError($"[User account are inactive] {error.Message}");
                break;

            case CurrentPasswordNotMatchWithStoredException:
                response.StatusCode = (int)HttpStatusCode.Forbidden;
                logger.LogError($"[Current password not match with stored password] {error.Message}");
                break;

            case UserEmailNotConfirmedYetException:
                response.StatusCode = (int)HttpStatusCode.Forbidden;
                logger.LogError($"[User email not confirmed yet] {error.Message}");
                break;

            default:
                response.StatusCode = (int)HttpStatusCode.InternalServerError;
                logger.LogError($"[Internal error request] {error.Message}");
                break;
        }
    }
}
