package entities

import (
	"time"

	"github.com/google/uuid"
	"github.com/oklog/ulid"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type MessageStatus struct {
	ObjectId       primitive.ObjectID `bson:"_id,omitempty" json:"objectId"`
	UserId         uuid.UUID          `bson:"userId" json:"userId"`
	MessageId      ulid.ULID          `bson:"messageId" json:"messageId"`
	ConversationId uuid.UUID          `bson:"conversationId" json:"conversationId"`
	ReadAt         *time.Time         `bson:"readAt" json:"readAt"`
	ReceivedAt     *time.Time         `bson:"receivedAt" json:"receivedAt"`
}

func (messageStatus *MessageStatus) Receive() {
	now := time.Now()
	messageStatus.ReceivedAt = &now
}

func (messageStatus *MessageStatus) Read() {
	now := time.Now()
	messageStatus.ReadAt = &now
}
