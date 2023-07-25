import { Injectable } from '@nestjs/common';

import { Message } from '@application/entities/message';
import { Conversation } from '@application/entities/conversation';

import { Either } from '@helpers/Either';

@Injectable()
export abstract class MessageRepository {
  abstract create(message: Message): Promise<Either<Error, void>>;
  abstract updateStatus(messageId: Message['id'], status: 'read' | 'received' | 'sent'): Promise<Either<Error, void>>;
  abstract readUnreadMessagedByConversationId(conversationId: Conversation['_id']): Promise<Either<Error, void>>;
}
