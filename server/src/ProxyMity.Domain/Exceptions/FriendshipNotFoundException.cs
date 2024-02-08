namespace ProxyMity.Domain.Exceptions;

public class FriendshipNotFoundException(Ulid requesterId, Ulid targetId) 
    : Exception($"Friendship not found with '{requesterId}' as requester Id, and '{targetId}' as target Id");