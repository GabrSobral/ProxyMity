package conversationController

import (
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
)

type PinConversationRequest struct {
	ConversationId uuid.UUID `json:"conversationId"`
	UserId         uuid.UUID `json:"userId"`
}

func (controller *ConversationController) PinConversation(w http.ResponseWriter, r *http.Request) {
	var pinConversationRequest PinConversationRequest
	err := json.NewDecoder(r.Body).Decode(&pinConversationRequest)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	err = controller.ConversationService.PinConversation(r.Context(), pinConversationRequest.UserId, pinConversationRequest.ConversationId)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
