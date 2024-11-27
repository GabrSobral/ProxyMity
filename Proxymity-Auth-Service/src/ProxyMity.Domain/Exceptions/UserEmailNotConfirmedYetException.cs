namespace ProxyMity.Domain.Exceptions;

public class UserEmailNotConfirmedYetException : Exception
{
    public UserEmailNotConfirmedYetException(Guid userId) : base($"The user e-mail was not confirmed yet: {userId}") { }
}
