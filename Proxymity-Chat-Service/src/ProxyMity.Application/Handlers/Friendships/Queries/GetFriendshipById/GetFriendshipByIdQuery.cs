namespace ProxyMity.Application;

public record GetFriendshipByIdQuery(
    Ulid RequesterId,
    Ulid TargetId
): IQuery<Friendship?>;
