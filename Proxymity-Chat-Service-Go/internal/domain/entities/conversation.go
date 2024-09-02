package entities

import (
	"time"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Conversation struct {
	ObjectId   primitive.ObjectID `bson:"_id,omitempty" json:"objectId"`
	Id         uuid.UUID          `bson:"id" json:"id"`
	GroupId    *uuid.UUID         `bson:"group_id" json:"group_id"`
	CreatedAt  time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt  *time.Time         `bson:"updated_at" json:"updated_at"`
	DisabledAt *time.Time         `bson:"disabled_at" json:"disabled_at"`
}

func NewConversation(groupId *uuid.UUID) *Conversation {
	return &Conversation{
		Id:      uuid.New(),
		GroupId: groupId,
	}
}
