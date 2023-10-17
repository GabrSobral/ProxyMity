namespace ProxyMity.Application.Handlers.Conversations.Commands.CreateGroupConversation;

public record CreateGroupConversationCommand(
    string Name,
    string? Description,
    Guid CreatorId,
    IEnumerable<Guid> Participants
) : ICommand<CreateGroupConversationResponse>;

public record CreateGroupConversationResponse {
    public Guid Id { get; set; }
    public Guid? GroupId { get; set; }
    public DateTime CreatedAt { get; set; }
    public IEnumerable<Guid> Participants { get; set; }

    public CreateGroupConversationResponse(Conversation conversation, IEnumerable<Guid> participants) {
        Id = conversation.Id;
        GroupId = conversation.GroupId;
        CreatedAt = conversation.CreatedAt;
        Participants = participants;
    }
};