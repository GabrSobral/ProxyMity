package repositories

import (
	"context"
	"proxymity/chat-server/internal/domain/entities"
	"proxymity/chat-server/internal/infra/database"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
)

type UserRepositoryImpl struct {
	db         *database.Database
	collection string
}

func NewUserRepository(db *database.Database) *UserRepositoryImpl {
	return &UserRepositoryImpl{db, "users"}
}

func (r *UserRepositoryImpl) Create(ctx context.Context, newUser entities.User) error {
	_, err := r.db.Db.
		Collection(r.collection).
		InsertOne(ctx, newUser)

	if err != nil {
		return err
	}

	return nil
}

func (r *UserRepositoryImpl) GetById(ctx context.Context, userId uuid.UUID) (*entities.User, error) {
	var user entities.User

	filter := bson.M{"id": userId}

	err := r.db.Db.
		Collection(r.collection).
		FindOne(ctx, filter).
		Decode(&user)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *UserRepositoryImpl) GetByEmail(ctx context.Context, userEmail string) (*entities.User, error) {
	var user entities.User

	filter := bson.M{"email": userEmail}

	err := r.db.Db.
		Collection(r.collection).
		FindOne(ctx, filter).
		Decode(&user)

	if err != nil {
		return nil, err
	}

	return &user, nil
}
