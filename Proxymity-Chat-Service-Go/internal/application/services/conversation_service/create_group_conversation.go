package services

import (
	"context"
	"proxymity/chat-server/internal/domain/entities"
	"sync"
	"time"

	"github.com/google/uuid"
)

type CreateGroupConversationRequest struct {
	Name         string      `json:"name"`
	Description  string      `json:"description"`
	CreatorId    uuid.UUID   `json:"creatorId"`
	Participants []uuid.UUID `json:"participants"`
}

type CreateGroupConversationResponse struct {
	Id           uuid.UUID   `json:"id"`
	GroupId      *uuid.UUID  `json:"groupId"`
	CreatedAt    time.Time   `json:"createdAt"`
	Participants []uuid.UUID `json:"participants"`
}

// CreateGroupConversation creates a group conversation with multiple participants.
func (cs *ConversationService) CreateGroupConversation(
	ctx context.Context,
	request *CreateGroupConversationRequest,
) (*CreateGroupConversationResponse, error) {
	participantsCount := len(request.Participants)

	group := entities.NewGroup(request.Name, request.Description, request.CreatorId)
	conversation := entities.NewConversation(&group.Id)

	var wg sync.WaitGroup
	var createErr error

	go func() {
		defer wg.Done()
		if err := cs.groupRepository.Create(ctx, group); err != nil {
			createErr = err
		}
	}()

	go func() {
		defer wg.Done()
		if err := cs.conversationRepository.Create(ctx, conversation); err != nil {
			createErr = err
		}
	}()

	wg.Wait()

	if createErr != nil {
		return nil, createErr
	}

	for i := 0; i < participantsCount; i++ {
		participantId := request.Participants[i]

		if _, err := cs.userRepository.GetById(ctx, participantId); err != nil {
			return nil, err
		}

		existentParticipation, err := cs.participantRepository.GetById(ctx, participantId, conversation.Id)

		if err != nil {
			return nil, err
		}

		if existentParticipation == nil {
			participant := entities.NewParticipant(participantId, conversation.Id)
			if err := cs.participantRepository.Add(ctx, participant); err != nil {
				return nil, err
			}
		}
	}

	return &CreateGroupConversationResponse{
		Id:           conversation.Id,
		GroupId:      &group.Id,
		CreatedAt:    conversation.CreatedAt,
		Participants: request.Participants,
	}, nil
}
