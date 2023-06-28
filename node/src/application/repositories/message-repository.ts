import { Message } from '@application/entities/message';
import { Conversation } from '@application/entities/conversation';

import { Either } from '@helpers/Either';

export interface MessageRepository {
  create(message: Message): Promise<Either<Error, void>>;
  updateStatus(messageId: Message['id'], status: 'read' | 'received' | 'sent'): Promise<Either<Error, void>>;
  readUnreadMessagedByConversationId(conversationId: Conversation['_id']): Promise<Either<Error, void>>;
}
