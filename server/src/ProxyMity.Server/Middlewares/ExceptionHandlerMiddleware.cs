namespace ProxyMity.Server.Middlewares;

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
            case MessageNotFoundException:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                logger.LogError($"[Message not found] {error.Message}");
                break;

            case NoJwtSecretWasProvidedException:
                response.StatusCode = (int)HttpStatusCode.InternalServerError;
                logger.LogError($"[No Jwt Secret as provided] {error.Message}");
                break;

            case EmailOrPasswordInvalidException:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                logger.LogError($"[Email or password invalid request] {error.Message}");
                break;

            case UserNotFoundException:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                logger.LogError($"[User not found request] {error.Message}");
                break;

            case ConversationNotFoundException:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                logger.LogError($"[Conversation not found request] {error.Message}");
                break;

            case UserAlreadyExistException:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                logger.LogError($"[User already exist request] {error.Message}");
                break;

            case InvalidParticipantsCounterOfConversationException:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                logger.LogError($"[Invalid participant counter request] {error.Message}");
                break;

            default:
                response.StatusCode = (int)HttpStatusCode.InternalServerError;
                logger.LogError($"[Internal error request] {error.Message}");
                break;
        }
    }
}
