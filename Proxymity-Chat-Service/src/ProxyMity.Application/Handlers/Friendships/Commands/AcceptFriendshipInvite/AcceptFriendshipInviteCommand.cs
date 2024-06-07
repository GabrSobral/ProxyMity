namespace ProxyMity.Application.Handlers.Friendships.Commands.AcceptFriendshipInvite;

public record AcceptFriendshipInviteCommand(
    Ulid CurrentUserId,
    Ulid RequesterUserId): ICommand<DateTime>;