﻿using ProxyMity.Infra.Messaging.Core.Exceptions;

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
            case RefreshTokenUnavailableForUserException:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                logger.LogError($"[Refresh token unavailable for user] {error.Message}");
                break;

            case RefreshTokenDecryptException:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                logger.LogError($"[Refresh token decryption error] {error.Message}");
                break;

            case RefreshTokenExpiredException:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                logger.LogError($"[Refresh token was expired] {error.Message}");
                break;

            case MessagingServiceConnectionException:
                response.StatusCode = (int)HttpStatusCode.InternalServerError;
                logger.LogError($"[Messaging service error] {error.Message}");
                break;

            case ConfirmationTokenAlreadyUsedException:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                logger.LogError($"[Confirmation token already used] {error.Message}");
                break;

            case ConfirmationTokenAlreadyExpiredException:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                logger.LogError($"[Confirmation token already expired] {error.Message}");
                break;

            case ConfirmationTokenInvalidException:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                logger.LogError($"[Confirmation token is invalid] {error.Message}");
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

            case EmailOrPasswordInvalidException:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                logger.LogError($"[Email or password is invalid] {error.Message}");
                break;

            case PasswordResetTokenNotFoundException:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                logger.LogError($"[Password reset token not found] {error.Message}");
                break;

            case PasswordResetTokenDontMatchException:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                logger.LogError($"[Password reset token do not match] {error.Message}");
                break;
            
            case UserWithoutPasswordException:
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                logger.LogError($"[User without password] {error.Message}");
                break;

            default:
                response.StatusCode = (int)HttpStatusCode.InternalServerError;
                logger.LogError($"[Internal error request] {error.Message}");
                break;
        }
    }
}
