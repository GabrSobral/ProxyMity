namespace ProxyMity.Domain.Exceptions;

public class ConfirmationTokenAlreadyUsedException(Guid confirmationToken)
    : Exception($"Confirmation token was already used: {confirmationToken}")
{
}