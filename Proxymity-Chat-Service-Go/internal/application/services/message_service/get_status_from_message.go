package services

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/oklog/ulid"
)

type GetStatusFromMessageRequest struct {
	MessageId      ulid.ULID `json:"messageId"`
	ConversationId uuid.UUID `json:"conversationId"`
}

type GetStatusFromMessageResponse struct {
	MessageId  ulid.ULID  `json:"messageId"`
	UserId     uuid.UUID  `json:"userId"`
	ReadAt     *time.Time `json:"readAt"`
	ReceivedAt *time.Time `json:"receivedAt"`
}

func (ms *MessageService) GetStatusFromMessage(ctx context.Context, messageId ulid.ULID, conversationId uuid.UUID) (*[]GetStatusFromMessageResponse, error) {
	statuses, err := ms.MessageStatusRepository.GetMessagesStatusByMessageId(ctx, messageId, conversationId)

	if err != nil {
		return nil, err
	}

	response := make([]GetStatusFromMessageResponse, len((*statuses)))

	for i, status := range *statuses {
		response[i] = GetStatusFromMessageResponse{
			MessageId:  status.MessageId,
			UserId:     status.UserId,
			ReadAt:     status.ReadAt,
			ReceivedAt: status.ReceivedAt,
		}
	}

	return &response, nil
}
