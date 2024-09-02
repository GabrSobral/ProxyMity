package services

import (
	"proxymity/chat-server/internal/infra/database/repositories"
)

type MessageService struct {
	MessageRepository       *repositories.MessageRepositoryImpl
	MessageStatusRepository *repositories.MessageStatusRepositoryImpl
}

func NewMessageService(
	messageRepository *repositories.MessageRepositoryImpl,
	messageStatusRepository *repositories.MessageStatusRepositoryImpl,
) *MessageService {
	return &MessageService{
		MessageRepository:       messageRepository,
		MessageStatusRepository: messageStatusRepository,
	}
}
