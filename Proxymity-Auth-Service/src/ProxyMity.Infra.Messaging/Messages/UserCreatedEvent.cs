namespace ProxyMity.Infra.Messaging.Messages;

[EntityName("user-created")]
public record UserCreatedEvent(
    Ulid Id,
    string FirstName,
    string? LastName,
    string Email,
    DateTime CreatedAt);
