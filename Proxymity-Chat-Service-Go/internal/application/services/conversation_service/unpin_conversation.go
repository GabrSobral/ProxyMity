package services

import (
	"context"

	"github.com/google/uuid"
)

// PinConversation pins a conversation for a user.
func (service *ConversationService) UnpinConversation(ctx context.Context, conversationId uuid.UUID, userId uuid.UUID) error {
	service.participantRepository.UnpinConversation(ctx, conversationId, userId)

	return nil
}
