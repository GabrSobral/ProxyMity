package services

import (
	"context"
	"proxymity/chat-server/internal/domain/entities"
	"time"

	"github.com/google/uuid"
)

type CreatePrivateConversationRequest struct {
	RequesterId   uuid.UUID `json:"requesterId"`
	ParticipantId uuid.UUID `json:"participantId"`
}

type CreatePrivateConversationResponse struct {
	Id           uuid.UUID   `json:"id"`
	GroupId      *uuid.UUID  `json:"groupId"`
	CreatedAt    time.Time   `json:"createdAt"`
	Participants []uuid.UUID `json:"participants"`
}

// CreatePrivateConversation creates a private conversation between two participants.
func (cs *ConversationService) CreatePrivateConversation(
	ctx context.Context,
	request CreatePrivateConversationRequest,
) (*CreatePrivateConversationResponse, error) {
	conversation := entities.NewConversation(nil)

	requesterParticipation := entities.NewParticipant(request.RequesterId, conversation.Id)
	participantParticipation := entities.NewParticipant(request.ParticipantId, conversation.Id)

	newConversation := entities.NewConversation(nil)

	if _, err := cs.participantRepository.GetById(ctx, request.RequesterId, conversation.Id); err != nil {
		return nil, err
	}

	if _, err := cs.participantRepository.GetById(ctx, request.ParticipantId, conversation.Id); err != nil {
		return nil, err
	}

	if err := cs.conversationRepository.Create(ctx, newConversation); err != nil {
		return nil, err
	}

	if err := cs.participantRepository.Add(ctx, requesterParticipation); err != nil {
		return nil, err
	}

	if err := cs.participantRepository.Add(ctx, participantParticipation); err != nil {
		return nil, err
	}

	return &CreatePrivateConversationResponse{
		Id:           conversation.Id,
		GroupId:      conversation.GroupId,
		CreatedAt:    conversation.CreatedAt,
		Participants: []uuid.UUID{request.RequesterId, request.ParticipantId},
	}, nil
}
