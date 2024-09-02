package conversationController

import (
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
)

type UnpinConversationRequest struct {
	ConversationId uuid.UUID `json:"conversationId"`
	UserId         uuid.UUID `json:"userId"`
}

func (controller *ConversationController) UnpinConversation(w http.ResponseWriter, r *http.Request) {
	var unpinConversationRequest UnpinConversationRequest
	err := json.NewDecoder(r.Body).Decode(&unpinConversationRequest)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	err = controller.ConversationService.UnpinConversation(r.Context(), unpinConversationRequest.UserId, unpinConversationRequest.ConversationId)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
