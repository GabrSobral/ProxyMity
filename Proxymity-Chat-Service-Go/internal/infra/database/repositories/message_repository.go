package repositories

import (
	"context"
	"fmt"
	"proxymity/chat-server/internal/domain/constants"
	"proxymity/chat-server/internal/domain/entities"
	"proxymity/chat-server/internal/infra/database"
	"time"

	"github.com/google/uuid"
	"github.com/oklog/ulid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type MessageRepository interface {
	Create(ctx context.Context, requesterId, participantId uuid.UUID) (*entities.Conversation, error)
	GetById(ctx context.Context, conversationId uuid.UUID) (*entities.Conversation, error)
	UpdateStatus(ctx context.Context, messageId uuid.UUID, status string) (*entities.Message, error)
	ReadUnreadMessagesByConversationId(ctx context.Context, userId, conversationId uuid.UUID) error
	GetUnreadConversationMessagesCount(ctx context.Context, userId, conversationId uuid.UUID) (int64, error)
	GetMessagesFromConversation(ctx context.Context, conversationId uuid.UUID, quantity uint) ([]*entities.Message, error)
}

type MessageRepositoryImpl struct {
	db         *database.Database
	collection string
}

func NewMessageRepository(db *database.Database) *MessageRepositoryImpl {
	return &MessageRepositoryImpl{db, "messages"}
}

func (r *MessageRepositoryImpl) Create(ctx context.Context, message *entities.Message) error {
	_, err := r.db.Db.Collection(r.collection).InsertOne(ctx, message)

	if err != nil {
		return err
	}

	return nil
}

func (r *MessageRepositoryImpl) GetById(ctx context.Context, messageId uuid.UUID) (*entities.Message, error) {
	var message entities.Message

	filter := bson.M{"id": messageId}

	err := r.db.Db.
		Collection(r.collection).
		FindOne(ctx, filter).
		Decode(&message)

	if err != nil {
		return nil, err
	}

	return &message, nil
}

func (r *MessageRepositoryImpl) UpdateStatus(ctx context.Context, messageId uuid.UUID, status uint) error {
	collection := r.db.Db.Collection(r.collection)

	var update bson.M

	switch status {
	case constants.Sent:
		update = bson.M{"$set": bson.M{"sent_at": time.Now().UTC()}}
	case constants.Received:
		update = bson.M{"$set": bson.M{"received_by_all_at": time.Now().UTC()}}
	case constants.Read:
		update = bson.M{"$set": bson.M{"read_by_all_at": time.Now().UTC()}}
	default:
		return fmt.Errorf(fmt.Sprintf("Invalid status: %d", status))
	}

	_, err := collection.UpdateOne(ctx, bson.M{"_id": messageId}, update)

	if err != nil {
		return err
	}

	return nil
}

func (r *MessageRepositoryImpl) ReadUnreadMessagesByConversationId(ctx context.Context, userId, conversationId uuid.UUID) error {
	collection := r.db.Db.Collection(r.collection)

	// Step 1: Retrieve the IDs of messages that need to be updated
	filter := bson.M{
		"conversation_id": conversationId,
		"read_by_all_at":  bson.M{"$eq": nil},
	}
	var messageIds []ulid.ULID

	cursor, err := collection.Find(ctx, filter, options.Find().SetProjection(bson.M{"_id": 1}))
	if err != nil {
		return err
	}

	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var result struct {
			Id ulid.ULID `bson:"id"`
		}

		if err := cursor.Decode(&result); err != nil {
			return err
		}

		messageIds = append(messageIds, result.Id)
	}

	if err := cursor.Err(); err != nil {
		return err
	}

	// Step 2: Update the messages
	updateFilter := bson.M{
		"id": bson.M{
			"$in": messageIds,
		},
	}
	update := bson.M{
		"$set": bson.M{
			"read_by_all_at": time.Now().UTC(),
		},
	}

	_, err = collection.UpdateMany(ctx, updateFilter, update)
	return err
}

func (r *MessageRepositoryImpl) GetUnreadConversationMessagesCount(ctx context.Context, userId, conversationId uuid.UUID) (int64, error) {
	collection := r.db.Db.Collection(r.collection)

	filter := bson.M{
		"conversation_id": conversationId,
		"author_id": bson.M{
			"$ne": userId, // $ne means "not equal"
		},
		"read_by_all_at": bson.M{
			"$eq": nil, // $eq with nil checks for null in MongoDB
		},
	}

	count, err := collection.CountDocuments(ctx, filter)

	if err != nil {
		return 0, err
	}

	return count, nil
}

func (r *MessageRepositoryImpl) GetMessagesFromConversation(ctx context.Context, conversationId uuid.UUID, quantity uint) ([]*entities.Message, error) {
	filter := bson.M{"conversation_id": conversationId}

	// FindOptions to sort by Id descending and limit the number of results
	findOptions := options.Find().
		SetSort(bson.D{{Key: "id", Value: -1}}).
		SetLimit(int64(quantity))

	// Perform the query
	cursor, err := r.db.Db.Collection(r.collection).Find(ctx, filter, findOptions)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	// Decode the results
	var messages []*entities.Message

	if err := cursor.All(ctx, &messages); err != nil {
		return nil, err
	}

	return messages, nil
}
