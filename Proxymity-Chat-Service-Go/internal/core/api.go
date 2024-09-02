package api

import (
	"fmt"
	"net/http"

	conversationServices "proxymity/chat-server/internal/application/services/conversation_service"

	// userServices "proxymity/chat-server/internal/application/services/user_service"

	"proxymity/chat-server/internal/infra/database"
	"proxymity/chat-server/internal/infra/database/repositories"

	"proxymity/chat-server/internal/presentation/http/controllers"
	conversationController "proxymity/chat-server/internal/presentation/http/controllers/conversation"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

type ApiHandler struct {
	router *chi.Mux
}

// ApiHandler implements the http.Handler interface and start the chi.Mux router
func (handler ApiHandler) ServeHTTP(writter http.ResponseWriter, request *http.Request) {
	handler.router.ServeHTTP(writter, request)
}

// Create a new ApiHandler, which is a wrapper around chi.Mux
func Initianize(db *database.Database) http.Handler {
	var router *chi.Mux = chi.NewRouter()
	var apiHandlerInstance = ApiHandler{router}

	router.Use(middleware.Logger)
	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	userRepository := repositories.NewUserRepository(db)
	groupRepository := repositories.NewGroupRepository(db)
	messageRepository := repositories.NewMessageRepository(db)
	participantRepository := repositories.NewParticipantRepository(db)
	conversationRepository := repositories.NewConversationRepository(db)
	messageStatusRepository := repositories.NewMessageStatusRepository(db)

	// userService := userServices.NewUserService(userRepository)
	conversationService := conversationServices.NewConversationService(
		conversationRepository,
		participantRepository,
		groupRepository,
		userRepository,
		messageRepository,
		messageStatusRepository,
	)

	// messageService := messageServices.NewMessageService(messageRepository, messageStatusRepository)

	// messageController := messageController.NewMessageController(*messageService)
	conversationController := conversationController.NewConversationController(*conversationService)

	router.Get("/health", controllers.HealthCheck)

	router.Route("/conversations", func(r chi.Router) {
		r.Get("/user/{userId}", conversationController.GetUserConversations)
		r.Post("/group", conversationController.CreateGroupConversation)
		r.Post("/private", conversationController.CreatePrivateConversation)

		r.Route("/{conversationId}", func(r chi.Router) {
			r.Post("/messages", conversationController.GetConversationMessages)
			r.Post("/pin", conversationController.PinConversation)
			r.Post("/unpin", conversationController.UnpinConversation)
		})
	})

	router.Route("/messages", func(r chi.Router) {})

	fmt.Println("✅ Server is running on port 3000")

	return apiHandlerInstance
}
