import { Message as PrismaMessage } from '@prisma/client';

import { User } from '@application/entities/user';
import { Message } from '@application/entities/message';
import { Conversation } from '@application/entities/conversation';

export interface IMessageViewModel {
  id: string;
  content: string;

  writtenAt: Date;
  sentAt: Date | null;
  receivedByAllAt: Date | null;
  readByAllAt: Date | null;

  conversationId: Conversation['_id'];
  repliedMessageId: Message['_id'] | null;
  authorId: User['_id'];
}

export class MessageViewModel {
  static parse(message: Message): IMessageViewModel {
    return {
      id: message.id,
      content: message.content,
      authorId: message.authorId,
      conversationId: message.conversationId,
      repliedMessageId: message.repliedMessageId,
      writtenAt: message.writtenAt,
      sentAt: message.sentAt,
      readByAllAt: message.readAt,
      receivedByAllAt: message.receivedAt,
    };
  }

  static prismaToViewModel(message: PrismaMessage): IMessageViewModel {
    return {
      id: message.id,
      content: message.content,
      authorId: message.author_id,
      conversationId: message.conversation_id,
      repliedMessageId: message.replied_message_id,
      writtenAt: message.written_at,
      sentAt: message.sent_at,
      readByAllAt: message.read_at,
      receivedByAllAt: message.received_at,
    };
  }
}
