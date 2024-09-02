package entities

import (
	"time"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Participant struct {
	ObjectId             primitive.ObjectID `bson:"_id,omitempty" json:"objectId"`
	Id                   uuid.UUID          `bson:"id" json:"id"`
	ConversationId       uuid.UUID          `bson:"conversationId" json:"conversationId"`
	CreatedAt            time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt            *time.Time         `bson:"updatedAt" json:"updatedAt"`
	RemovedAt            *time.Time         `bson:"removedAt" json:"removedAt"`
	ConversationPinnedAt *time.Time         `bson:"conversationPinnedAt" json:"conversationPinnedAt"`
}

func NewParticipant(id uuid.UUID, conversationId uuid.UUID) *Participant {
	return &Participant{
		Id:             id,
		ConversationId: conversationId,
		CreatedAt:      time.Now(),
	}
}
