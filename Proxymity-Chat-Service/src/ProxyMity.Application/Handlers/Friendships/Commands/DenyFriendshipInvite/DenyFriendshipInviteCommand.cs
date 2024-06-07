namespace ProxyMity.Application.Handlers.Friendships.Commands.DenyFriendshipInvite;

public record DenyFriendshipInviteCommand(
    Ulid CurrentUserId,
    Ulid RequesterUserId): ICommand<DateTime>;