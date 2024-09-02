package messageController

import services "proxymity/chat-server/internal/application/services/message_service"

type MessageController struct {
	MessageService *services.MessageService
}

func NewMessageController(messageService *services.MessageService) *MessageController {
	return &MessageController{
		MessageService: messageService,
	}
}
