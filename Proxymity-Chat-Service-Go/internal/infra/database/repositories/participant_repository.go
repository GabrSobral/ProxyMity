package repositories

import (
	"context"
	"proxymity/chat-server/internal/domain/entities"
	"proxymity/chat-server/internal/infra/database"
	"time"

	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type ParticipantRepository interface {
	Add(ctx context.Context, participant *entities.Participant) error
	Remove(ctx context.Context, participant *entities.Participant) error
	PinConversation(ctx context.Context, conversationId uuid.UUID, userId uuid.UUID) error
	UnpinConversation(ctx context.Context, conversationId uuid.UUID, userId uuid.UUID) error
	GetById(ctx context.Context, userId uuid.UUID, conversationId uuid.UUID) (*entities.Participant, error)
	GetByUserId(ctx context.Context, userId uuid.UUID) ([]entities.Participant, error)
	GetByConversationId(ctx context.Context, conversationId uuid.UUID) ([]entities.Participant, error)
	GetConversationsByUserId(ctx context.Context, userId uuid.UUID) (*[]GetConversationsByUserId, error)
	GetParticipantsByConversationId(ctx context.Context, conversationId uuid.UUID) (*[]GetParticipantsByConversationId, error)
}

type ParticipantRepositoryImpl struct {
	db         *database.Database
	collection string
}

func NewParticipantRepository(db *database.Database) *ParticipantRepositoryImpl {
	return &ParticipantRepositoryImpl{
		db,
		"participants",
	}
}

type GetConversationsByUserId struct {
	Id                   uuid.UUID
	CreatedAt            time.Time
	GroupName            *string
	GroupDescription     *string
	GroupId              *uuid.UUID
	ConversationPinnedAt *time.Time
}

type GetParticipantsByConversationId struct {
	Id         uuid.UUID
	FirstName  string
	LastName   string
	Email      string
	PhotoUrl   *string
	LastOnline *time.Time
	CreatedAt  time.Time
	RemovedAt  *time.Time
}

func (r *ParticipantRepositoryImpl) Add(ctx context.Context, participant *entities.Participant) error {
	_, err := r.db.Db.Collection(r.collection).InsertOne(ctx, participant)

	if err != nil {
		return err
	}

	return nil
}

func (r *ParticipantRepositoryImpl) Remove(ctx context.Context, participant *entities.Participant) error {
	_, err := r.db.Db.Collection(r.collection).DeleteOne(ctx, participant)

	if err != nil {
		return err
	}

	return nil
}

func (r *ParticipantRepositoryImpl) PinConversation(ctx context.Context, conversationId uuid.UUID, userId uuid.UUID) error {
	return nil
}

func (r *ParticipantRepositoryImpl) UnpinConversation(ctx context.Context, conversationId uuid.UUID, userId uuid.UUID) error {
	return nil
}

func (r *ParticipantRepositoryImpl) GetById(ctx context.Context, userId uuid.UUID, conversationId uuid.UUID) (*entities.Participant, error) {
	var participant entities.Participant

	filter := bson.M{"userId": userId, "conversationId": conversationId}

	err := r.db.Db.
		Collection(r.collection).
		FindOne(ctx, filter).
		Decode(&participant)

	if err != nil {
		return nil, err
	}

	return &participant, nil
}

func (r *ParticipantRepositoryImpl) GetByUserId(ctx context.Context, userId uuid.UUID) ([]entities.Participant, error) {
	return nil, nil
}

func (r *ParticipantRepositoryImpl) GetByConversationId(ctx context.Context, conversationId uuid.UUID) ([]entities.Participant, error) {
	return nil, nil
}

func (r *ParticipantRepositoryImpl) GetConversationsByUserId(ctx context.Context, userId uuid.UUID) (*[]GetConversationsByUserId, error) {
	participantsCollection := r.db.Db.Collection(r.collection)

	// Aggregation pipeline
	pipeline := mongo.Pipeline{
		// Match documents where UserId is equal to the provided userId
		{{
			Key:   "$match",
			Value: bson.D{{Key: "userId", Value: userId}},
		}},

		// Lookup to join with the Conversations collection
		{{Key: "$lookup", Value: bson.D{
			{Key: "from", Value: "conversations"},
			{Key: "localField", Value: "conversationId"},
			{Key: "foreignField", Value: "id"},
			{Key: "as", Value: "conversation"},
		}}},

		// Unwind the conversation array
		{{
			Key:   "$unwind",
			Value: "$conversation",
		}},

		// Lookup to join with the Groups collection
		{{
			Key: "$lookup",
			Value: bson.D{
				{Key: "from", Value: "groups"},
				{Key: "localField", Value: "conversation.groupId"},
				{Key: "foreignField", Value: "id"},
				{Key: "as", Value: "conversation.group"},
			},
		}},

		// Unwind the group array
		{{
			Key:   "$unwind",
			Value: "$conversation.group",
		}},

		// Project the necessary fields
		{{
			Key: "$project",
			Value: bson.D{
				{Key: "conversationId", Value: 1},
				{Key: "createdAt", Value: 1},
				{Key: "groupName", Value: "$conversation.group.name"},
				{Key: "groupDescription", Value: `$conversation.group.description`},
				{Key: "groupId", Value: "$conversation.groupId"},
				{Key: "conversationPinnedAt", Value: 1},
			},
		}},
	}

	cursor, err := participantsCollection.Aggregate(ctx, pipeline)

	if err != nil {
		return nil, err
	}

	defer cursor.Close(ctx)

	var results []GetConversationsByUserId
	if err := cursor.All(ctx, &results); err != nil {
		return nil, err
	}

	return &results, nil
}

func (r *ParticipantRepositoryImpl) GetParticipantsByConversationId(ctx context.Context, conversationId uuid.UUID) (*[]GetParticipantsByConversationId, error) {
	return nil, nil
}
