package repositories

import (
	"context"
	"proxymity/chat-server/internal/domain/entities"
	"proxymity/chat-server/internal/infra/database"

	"github.com/google/uuid"
	"github.com/oklog/ulid"
)

type MessageStatusRepository interface {
	Create(ctx context.Context, messageStatus entities.MessageStatus) error
	UpdateStatus(ctx context.Context, messageId ulid.ULID, conversationId uuid.UUID) error
	ReceiveUnreceivedMessagesByUserId(ctx context.Context, userId uuid.UUID) error
	GetUnreadMessagesStatusFromConversationById(ctx context.Context, conversationId uuid.UUID) ([]entities.MessageStatus, error)
	GetUnreadMessagesStatusCountByUserId(ctx context.Context, userId uuid.UUID) (uint, error)
	GetMessagesStatusByMessageId(ctx context.Context, conversationId uuid.UUID, messageId ulid.ULID) ([]entities.MessageStatus, error)
}

type MessageStatusRepositoryImpl struct {
	db         *database.Database
	collection string
}

func NewMessageStatusRepository(db *database.Database) *MessageStatusRepositoryImpl {
	return &MessageStatusRepositoryImpl{
		db, "message_status",
	}
}

func (r *MessageStatusRepositoryImpl) Create(ctx context.Context, messageStatus *entities.MessageStatus) error {
	_, err := r.db.Db.Collection(r.collection).InsertOne(ctx, messageStatus)

	if err != nil {
		return err
	}

	return nil
}

func (r *MessageStatusRepositoryImpl) UpdateStatus(ctx context.Context, messageStatus *entities.MessageStatus) error {
	return nil
}

func (r *MessageStatusRepositoryImpl) ReceiveUnreceivedMessagesByUserId() error {
	return nil
}

func (r *MessageStatusRepositoryImpl) GetUnreadMessagesStatusFromConversationById() error {
	return nil
}

func (r *MessageStatusRepositoryImpl) GetUnreadMessagesStatusCountByUserId() error {
	return nil
}

func (r *MessageStatusRepositoryImpl) GetMessagesStatusByMessageId(ctx context.Context, messageId ulid.ULID, conversationId uuid.UUID) (*[]entities.MessageStatus, error) {
	return nil, nil
}
