namespace ProxyMity.Application.Handlers.Conversations.Commands.CreatePrivateConversation;

public record CreatePrivateConversationCommand(
    Guid RequesterId,
    Guid ParticipantId
) : ICommand<CreatePrivateConversationResponse>;

public record CreatePrivateConversationRequest(
    Guid ParticipantId
);

public record CreatePrivateConversationResponse {
    public Guid Id { get; set; }
    public Guid? GroupId { get; set; }
    public DateTime CreatedAt { get; set; }
    public IEnumerable<Guid> Participants { get; set; }

    public CreatePrivateConversationResponse(Conversation conversation, IEnumerable<Guid> participants) {
        Id = conversation.Id;
        GroupId = conversation.GroupId;
        CreatedAt = conversation.CreatedAt;
        Participants = participants;
    }
};