package repositories

import (
	"context"
	"proxymity/chat-server/internal/domain/entities"
	"proxymity/chat-server/internal/infra/database"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
)

type GroupRepository interface {
	Create(ctx context.Context, group *entities.Group) error
	FindById(ctx context.Context, id uuid.UUID) (*entities.Group, error)
}

type GroupRepositoryImpl struct {
	db         *database.Database
	collection string
}

func NewGroupRepository(db *database.Database) *GroupRepositoryImpl {
	return &GroupRepositoryImpl{db, "groups"}
}

func (r *GroupRepositoryImpl) Create(ctx context.Context, group *entities.Group) error {
	_, err := r.db.Db.Collection(r.collection).InsertOne(ctx, group)

	if err != nil {
		return err
	}

	return nil
}

func (r *GroupRepositoryImpl) FindById(ctx context.Context, groupId uuid.UUID) (*entities.Group, error) {
	var group entities.Group

	filter := bson.M{"id": groupId}

	err := r.db.Db.
		Collection(r.collection).
		FindOne(ctx, filter).
		Decode(&group)

	if err != nil {
		return nil, err
	}

	return &group, nil
}
