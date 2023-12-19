﻿namespace ProxyMity.Application.Handlers.Conversations.Commands.CreatePrivateConversation;

public class CreatePrivateConversationCommandHandler(
    ILogger<CreatePrivateConversationCommandHandler> logger,

    IConversationRepository conversationRepository,
    IParticipantRepository participantRepository,
    IUserRepository userRepository,

    IUnitOfWork unitOfWork
) : ICommandHandler<CreatePrivateConversationCommand, CreatePrivateConversationResponse>
{
    public async Task<CreatePrivateConversationResponse> Handle(CreatePrivateConversationCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation($"Creating a private conversation...");

        Guid requesterId = request.RequesterId;
        Guid participantId = request.ParticipantId;

        await Task.WhenAll([
            userRepository.FindByIdAsync(requesterId) ?? throw new UserNotFoundException(requesterId),
            userRepository.FindByIdAsync(participantId) ?? throw new UserNotFoundException(participantId)
        ]);

        var conversation = Conversation.Create();
        var requesterParticipation = Participant.Create(requesterId, conversation.Id);
        var targetParticipation = Participant.Create(participantId, conversation.Id);

        unitOfWork.BeginTransaction();

        await conversationRepository.CreateAsync(conversation);

        await Task.WhenAll([
            participantRepository.AddAsync(requesterParticipation),
            participantRepository.AddAsync(targetParticipation)
        ]);

        unitOfWork.Commit();

        logger.LogInformation($"A private conversation between {requesterId} and {participantId} was created successfully!");

        Guid[] participantsId = [requesterId, participantId];

        return new CreatePrivateConversationResponse(conversation, participantsId);
    }
}