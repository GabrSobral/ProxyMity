namespace ProxyMity.Application.Handlers.Conversations.Commands.CreateGroupConversation;

public record CreateGroupConversationCommand(
    string Name,
    string? Description,
    Ulid CreatorId,
    IEnumerable<Ulid> Participants
) : ICommand<CreateGroupConversationResponse>;

public record CreateGroupConversationRequest(
    string Name,
    string? Description,
    IEnumerable<Ulid> Participants
);

public record CreateGroupConversationResponse
{
    public Ulid Id { get; set; }
    public Ulid? GroupId { get; set; }
    public DateTime CreatedAt { get; set; }
    public IEnumerable<Ulid> Participants { get; set; }

    public CreateGroupConversationResponse(Conversation conversation, IEnumerable<Ulid> participants)
    {
        Id = conversation.Id;
        GroupId = conversation.GroupId;
        CreatedAt = conversation.CreatedAt;
        Participants = participants;
    }
};