namespace ProxyMity.Domain.Exceptions;

public class EmailOrPasswordInvalidException : Exception
{
    public EmailOrPasswordInvalidException() : base("Email or password invalid!") { }
}
