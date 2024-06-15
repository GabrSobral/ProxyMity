namespace ProxyMity.Application.Handlers.Authentication.SignUp;

public record UserCreatedEvent(
    Ulid Id,
    string FirstName,
    string? LastName,
    DateTime CreatedAt);
