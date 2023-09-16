import { Message } from '@application/entities/message';
import { Message as PrismaMessage } from '@prisma/client';

export class PrismaMessageMapper {
  static toDomain(raw: PrismaMessage): Message {
    return Message.create(
      {
        authorId: raw.author_id,
        content: raw.content,
        conversationId: raw.conversation_id,
        repliedMessageId: raw.replied_message_id,
        writtenAt: raw.written_at,
        sentAt: raw.sent_at,
        receivedByAllAt: raw.received_at,
        readByAllAt: raw.read_at,
      },
      raw.id,
    );
  }

  static toPrisma(message: Message): PrismaMessage {
    return {
      id: message.id,
      author_id: message.authorId,
      content: message.content,
      conversation_id: message.conversationId,
      replied_message_id: message.repliedMessageId,
      written_at: message.writtenAt,
      sent_at: message.sentAt,
      received_at: message.receivedAt,
      read_at: message.readAt,
    };
  }
}
