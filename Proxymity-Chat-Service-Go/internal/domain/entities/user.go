package entities

import (
	"time"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ObjectId   primitive.ObjectID `bson:"_id,omitempty" json:"objectId"`
	Id         uuid.UUID          `bson:"id" json:"id"`
	FirstName  string             `bson:"first_name" json:"firstName"`
	LastName   string             `bson:"last_name" json:"lastName"`
	Email      string             `bson:"email" json:"email"`
	LastOnline *time.Time         `bson:"last_online" json:"lastOnline"`
	CreatedAt  time.Time          `bson:"created_at" json:"createdAt"`
	UpdatedAt  *time.Time         `bson:"updated_at" json:"updatedAt"`
}

func NewUser(firstName, lastName, email string) *User {
	return &User{
		Id:         uuid.New(),
		FirstName:  firstName,
		LastName:   lastName,
		Email:      email,
		LastOnline: nil,
		CreatedAt:  time.Now(),
		UpdatedAt:  nil,
	}
}
