package services

import (
	"context"
	"proxymity/chat-server/internal/domain/entities"
	"proxymity/chat-server/internal/infra/database/repositories"
	"sort"
	"time"

	"github.com/google/uuid"
)

type GetUserConversationsRequest struct{}
type GetUserConversationsResponse struct {
	Conversation        repositories.GetConversationsByUserId          `json:"conversation"`
	UnreadMessagesCount int                                            `json:"unreadMessagesCount"`
	Participants        []repositories.GetParticipantsByConversationId `json:"participants"`
	LastMessages        []*entities.Message                            `json:"lastMessages"`
}

func (cs *ConversationService) GetUserConversations(
	ctx context.Context,
	userId uuid.UUID,
) ([]GetUserConversationsResponse, error) {
	conversationsThatUserParticipate, err := cs.participantRepository.GetConversationsByUserId(ctx, userId)

	if err != nil {
		return nil, err
	}

	conversations := make([]GetUserConversationsResponse, len(*conversationsThatUserParticipate))

	for i, conversation := range *conversationsThatUserParticipate {
		participants, err := cs.participantRepository.GetParticipantsByConversationId(ctx, conversation.Id)

		if err != nil {
			return nil, err
		}

		lastMessages, err := cs.messageRepository.GetMessagesFromConversation(ctx, conversation.Id, 1)

		if err != nil {
			return nil, err
		}

		var unreadMessagesCount int

		if conversation.GroupId != nil {
			cs.messageRepository.GetUnreadConversationMessagesCount(ctx, conversation.Id, userId)
		} else {
			cs.messageRepository.GetUnreadConversationMessagesCount(ctx, conversation.Id, userId)
		}

		conversations[i] = GetUserConversationsResponse{
			Conversation:        conversation,
			UnreadMessagesCount: unreadMessagesCount,
			Participants:        *participants,
			LastMessages:        lastMessages,
		}

		sort.Slice(conversations, func(i, j int) bool {
			var currDate, prevDate time.Time

			if len(conversations[i].LastMessages) > 0 {
				currDate = conversations[i].LastMessages[0].WrittenAt
			} else {
				currDate = time.Time{}
			}

			if len(conversations[j].LastMessages) > 0 {
				prevDate = conversations[j].LastMessages[0].WrittenAt
			} else {
				prevDate = time.Time{}
			}

			return prevDate.Before(currDate)
		})
	}

	return conversations, nil
}
