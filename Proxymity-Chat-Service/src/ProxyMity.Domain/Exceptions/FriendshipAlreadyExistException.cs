namespace ProxyMity.Domain.Exceptions;

public class FriendshipAlreadyExistException(Ulid requesterId, Ulid targetId) 
        : Exception($"The friendship of '{requesterId}' and '{targetId}' already exists") { }