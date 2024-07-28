namespace ProxyMity.Infra.Messaging.Messages;

[EntityName("user-created")]
public record UserCreatedEvent(
    string Id,
    string FirstName,
    string? LastName,
    string Email,
    DateTime CreatedAt);
