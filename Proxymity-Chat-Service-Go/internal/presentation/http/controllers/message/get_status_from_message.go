package messageController

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/oklog/ulid"
)

func (mc *MessageController) GetStatusFromMessageController(w http.ResponseWriter, r *http.Request) {
	messageId := chi.URLParam(r, "messageId")
	converastionId := chi.URLParam(r, "conversationId")

	messageIdUlid, err := ulid.Parse(messageId)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	converastionIdUuid, err := uuid.Parse(converastionId)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	status, err := mc.MessageService.GetStatusFromMessage(r.Context(), messageIdUlid, converastionIdUuid)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	fmt.Println(status)
	// utils.sendJson(w, status, http.StatusOK)
}
