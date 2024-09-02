package entities

import (
	"time"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Group struct {
	ObjectId    primitive.ObjectID `bson:"_id,omitempty" json:"objectId"`
	Id          uuid.UUID          `bson:"id" json:"id"`
	Name        string             `bson:"name" json:"name"`
	Description string             `bson:"description" json:"description"`
	CreatedAt   time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt   *time.Time         `bson:"updatedAt" json:"updatedAt"`
	CreatedBy   uuid.UUID          `bson:"createdBy" json:"createdBy"`
}

func NewGroup(name, description string, createdBy uuid.UUID) *Group {
	return &Group{
		Id:          uuid.New(),
		Name:        name,
		Description: description,
		CreatedAt:   time.Now(),
		CreatedBy:   createdBy,
	}
}
