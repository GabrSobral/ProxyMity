namespace ProxyMity.Application.Handlers.Friendships.Commands.CreateFriendshipInvite;

public record CreateFriendshipInviteCommand(
    Ulid RequesterUserId,
    Ulid TargetUserId): ICommand;