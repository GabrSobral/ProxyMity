namespace ProxyMity.Application.Handlers.Users.Consumers.UserCreated;

public record UserCreatedEvent(
    Ulid Id,
    string FirstName,
    string? LastName,
    DateTime CreatedAt);
