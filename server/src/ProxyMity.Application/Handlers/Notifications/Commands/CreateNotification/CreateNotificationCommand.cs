namespace ProxyMity.Application.Handlers.Notifications.Commands.CreateNotification;

public record CreateNotificationCommand(
    Ulid UserId,
    Ulid ConversationId,
    ENotificationType NotificationType
);
