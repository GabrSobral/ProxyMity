package conversationController

import (
	services "proxymity/chat-server/internal/application/services/conversation_service"
)

type ConversationController struct {
	ConversationService services.ConversationService
}

func NewConversationController(conversationService services.ConversationService) *ConversationController {
	return &ConversationController{
		ConversationService: conversationService,
	}
}
