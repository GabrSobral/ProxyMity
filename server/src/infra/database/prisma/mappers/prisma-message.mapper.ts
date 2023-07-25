import { MessageStatus } from '@application/entities/message-status';
import { MessageStatus as PrismaMessageStatus } from '@prisma/client';

export class PrismaMessageStatusMapper {
  static toDomain(raw: PrismaMessageStatus): MessageStatus {
    return MessageStatus.create({
      conversationId: raw.conversation_id,
      messageId: raw.message_id,
      userId: raw.user_id,
      readAt: raw.read_at || undefined,
      receivedAt: raw.received_at || undefined,
    });
  }

  static toPrisma(messageStatus: MessageStatus): PrismaMessageStatus {
    return {
      conversation_id: messageStatus.conversationId,
      message_id: messageStatus.messageId,
      read_at: messageStatus.readAt,
      received_at: messageStatus.receivedAt,
      user_id: messageStatus.userId,
    };
  }
}
