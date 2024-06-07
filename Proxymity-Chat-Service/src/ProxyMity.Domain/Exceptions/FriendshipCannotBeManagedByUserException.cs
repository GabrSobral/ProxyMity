namespace ProxyMity.Domain.Exceptions;

public class FriendshipCannotBeManagedByUserException(Ulid userId)
    : Exception($"The user '{userId}' cannot manage the friendship.");