namespace ProxyMity.Domain.Exceptions;

public class CurrentPasswordNotMatchWithStoredException(Guid userId)
    : Exception($"The current password does not match with the stored password: {userId}");
