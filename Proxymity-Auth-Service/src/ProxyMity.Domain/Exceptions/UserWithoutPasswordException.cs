namespace ProxyMity.Domain.Exceptions;

public class UserWithoutPasswordException: Exception    
{
    public UserWithoutPasswordException(Guid userId) : base($"The user do not have a password registered: {userId}") { }
}