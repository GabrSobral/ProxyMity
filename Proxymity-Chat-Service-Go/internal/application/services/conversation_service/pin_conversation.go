package services

import (
	"context"

	"github.com/google/uuid"
)

// PinConversation pins a conversation for a user.
func (service *ConversationService) PinConversation(ctx context.Context, conversationId uuid.UUID, userId uuid.UUID) error {
	service.participantRepository.PinConversation(ctx, conversationId, userId)

	return nil
}
