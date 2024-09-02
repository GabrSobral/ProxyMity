package entities

import (
	"time"

	"github.com/google/uuid"
	"github.com/oklog/ulid"
)

type Message struct {
	ObjectId         ulid.ULID  `bson:"_id,omitempty" json:"objectId"`
	Id               ulid.ULID  `bson:"id" json:"id"`
	Content          string     `bson:"content" json:"content"`
	ConversationId   uuid.UUID  `bson:"conversationId" json:"conversationId"`
	WrittenAt        time.Time  `bson:"writtenAt" json:"writtenAt"`
	SentAt           *time.Time `bson:"sentAt" json:"sentAt"`
	ReceivedByAllAt  *time.Time `bson:"receivedByAllAt" json:"receivedByAllAt"`
	ReadByAllAt      *time.Time `bson:"readByAllAt" json:"readByAllAt"`
	RepliedMessageId *ulid.ULID `bson:"repliedMessageId" json:"repliedMessageId"`
	AuthorId         uuid.UUID  `bson:"authorId" json:"authorId"`
}

var now time.Time = time.Now()

func (message *Message) Send() {
	message.SentAt = &now
}

func (message *Message) ReceiveByAll() {
	message.ReceivedByAllAt = &now
}

func (message *Message) ReadByAll() {
	message.ReadByAllAt = &now
}
