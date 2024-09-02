package repositories

import (
	"context"
	"proxymity/chat-server/internal/domain/entities"
	"proxymity/chat-server/internal/infra/database"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
)

type ConversationRepository struct {
	db         *database.Database
	collection string
}

func NewConversationRepository(db *database.Database) *ConversationRepository {
	return &ConversationRepository{db, "conversations"}
}

func (r *ConversationRepository) Create(ctx context.Context, conversation *entities.Conversation) error {
	_, err := r.db.Db.Collection(r.collection).InsertOne(ctx, conversation)

	if err != nil {
		return err
	}

	return nil
}

func (r *ConversationRepository) GetById(ctx context.Context, conversationId uuid.UUID) (*entities.Conversation, error) {
	var conversation entities.Conversation

	filter := bson.M{"id": conversationId}

	err := r.db.Db.
		Collection(r.collection).
		FindOne(ctx, filter).
		Decode(&conversation)

	if err != nil {
		return nil, err
	}

	return &conversation, nil
}
