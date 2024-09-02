package conversationController

import (
	"fmt"
	"net/http"
	utils "proxymity/chat-server/internal/presentation/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

// GetUserConversations is a method that returns all conversations of a user
// /user/{userId}
func (controller *ConversationController) GetUserConversations(w http.ResponseWriter, r *http.Request) {
	userIdString := chi.URLParam(r, "userId")
	userId, err := uuid.Parse(userIdString)

	fmt.Printf("userIdString: %v\n", userIdString)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	conversations, err := controller.ConversationService.GetUserConversations(r.Context(), userId)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	fmt.Println(conversations)

	utils.SendJson(w, conversations, http.StatusOK)
}
