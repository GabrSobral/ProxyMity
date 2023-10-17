namespace ProxyMity.Domain.Exceptions;

public class UserNotFoundException : Exception {
    public UserNotFoundException() : base("User not found") { }
    public UserNotFoundException(string email) : base($"Any user was found with this email: {email}") { }
    public UserNotFoundException(Guid userId) : base($"Any user was found with this id: {userId}") { }
}
