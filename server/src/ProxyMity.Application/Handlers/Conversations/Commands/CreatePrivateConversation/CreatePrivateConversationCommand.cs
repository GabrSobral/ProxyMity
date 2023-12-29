namespace ProxyMity.Application.Handlers.Conversations.Commands.CreatePrivateConversation;

public record CreatePrivateConversationCommand(
    Ulid RequesterId,
    Ulid ParticipantId
) : ICommand<CreatePrivateConversationResponse>;

public record CreatePrivateConversationRequest(
    Ulid ParticipantId
);

public record CreatePrivateConversationResponse
{
    public Ulid Id { get; set; }
    public Ulid? GroupId { get; set; }
    public DateTime CreatedAt { get; set; }
    public IEnumerable<Ulid> Participants { get; set; }

    public CreatePrivateConversationResponse(Conversation conversation, IEnumerable<Ulid> participants)
    {
        Id = conversation.Id;
        GroupId = conversation.GroupId;
        CreatedAt = conversation.CreatedAt;
        Participants = participants;
    }
};