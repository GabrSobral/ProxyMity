namespace ProxyMity.Application;

public class GetFriendshipByIdQueryHandler(
    ILogger<GetFriendshipByIdQueryHandler> logger,
    IFriendshipRepository friendshipRepository
) : IQueryHandler<GetFriendshipByIdQuery, Friendship>
{
    public async Task<Friendship?> Handle(
        GetFriendshipByIdQuery request, 
        CancellationToken cancellationToken)
    {
        logger.LogInformation($"Searching for friendship. RequesterId: {request.RequesterId}; TargetId: {request.TargetId}");

        return await friendshipRepository.GetFriendshipInvite(
            requesterId: request.RequesterId,
            targetId: request.TargetId, 
            cancellationToken: cancellationToken
        );
    }
}
