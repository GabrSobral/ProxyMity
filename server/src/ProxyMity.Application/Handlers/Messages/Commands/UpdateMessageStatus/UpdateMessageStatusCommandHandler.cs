namespace ProxyMity.Application.Handlers.Messages.Commands.UpdateMessageStatus;

public sealed class UpdateMessageStatusCommandHandler : ICommandHandler<UpdateMessageStatusCommand> {
    private readonly ILogger<UpdateMessageStatusCommandHandler> _logger;
    private readonly IMessageRepository _messageRepository;
    private readonly IMessageStatusRepository _messageStatusRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateMessageStatusCommandHandler(
        ILogger<UpdateMessageStatusCommandHandler> logger,
        IMessageRepository messageRepository,
        IMessageStatusRepository messageStatusRepository,
        IUnitOfWork unitOfWork
    ) {
        _logger = logger;
        _messageRepository = messageRepository;
        _messageStatusRepository = messageStatusRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task Handle(UpdateMessageStatusCommand request, CancellationToken cancellationToken) {
        _unitOfWork.BeginTransaction();

        if (request.IsConversationGroup)
            await UpdateGroupMessage(request.MessageId, request.Status, request.UserId, request.ConversationId);
        else
            await UpdatePrivateMessage(request.MessageId, request.Status);

        _unitOfWork.Commit();
    }

    private async Task UpdatePrivateMessage(Guid messageId, EMessageStatuses messageStatus) {
        await _messageRepository.UpdateStatusAsync(messageId, messageStatus);
    }

    private async Task UpdateGroupMessage(Guid messageId, EMessageStatuses messageStatus, Guid userId, Guid conversationId) {
        switch (messageStatus) {
            case EMessageStatuses.SENT: {
                    await _messageRepository.UpdateStatusAsync(messageId, EMessageStatuses.SENT);
                    break;
                }

            case EMessageStatuses.READ: {
                    await _messageStatusRepository.ReceiveAsync(messageId, userId);
                    var allMessageStatusFromMessage = await _messageStatusRepository.GetMessagesStatusByMessageIdAsync(messageId, conversationId);

                    var allParticipantsReadTheMessage = allMessageStatusFromMessage.All(item => item.ReadAt is not null);

                    if (allParticipantsReadTheMessage)
                        await _messageRepository.UpdateStatusAsync(messageId, EMessageStatuses.READ);
                    break;
                }

            case EMessageStatuses.RECEIVED: {
                    await _messageStatusRepository.ReceiveAsync(messageId, userId);
                    var allMessageStatusFromMessage = await _messageStatusRepository.GetMessagesStatusByMessageIdAsync(messageId, conversationId);

                    var allParticipantsReceiveTheMessage = allMessageStatusFromMessage.All(item => item.ReceivedAt is not null);

                    if (allParticipantsReceiveTheMessage)
                        await _messageRepository.UpdateStatusAsync(messageId, EMessageStatuses.RECEIVED);
                    break;
                }
        }
    }
}
