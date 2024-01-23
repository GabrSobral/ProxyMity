namespace ProxyMity.Domain.Exceptions;

public sealed class EmailOrPasswordInvalidException : Exception
{
    public EmailOrPasswordInvalidException() : base("Email or password invalid!") { }
}
