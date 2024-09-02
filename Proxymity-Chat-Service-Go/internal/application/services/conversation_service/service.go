package services

import "proxymity/chat-server/internal/infra/database/repositories"

type ConversationService struct {
	conversationRepository  *repositories.ConversationRepository
	participantRepository   *repositories.ParticipantRepositoryImpl
	groupRepository         *repositories.GroupRepositoryImpl
	userRepository          *repositories.UserRepositoryImpl
	messageRepository       *repositories.MessageRepositoryImpl
	messageStatusRepository *repositories.MessageStatusRepositoryImpl
}

// NewConversationService creates a new ConversationService
func NewConversationService(
	conversationRepository *repositories.ConversationRepository,
	participantRepository *repositories.ParticipantRepositoryImpl,
	groupRepository *repositories.GroupRepositoryImpl,
	userRepository *repositories.UserRepositoryImpl,
	messageRepository *repositories.MessageRepositoryImpl,
	messageStatusRepository *repositories.MessageStatusRepositoryImpl,
) *ConversationService {
	return &ConversationService{
		conversationRepository,
		participantRepository,
		groupRepository,
		userRepository,
		messageRepository,
		messageStatusRepository,
	}
}
