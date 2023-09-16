import { Injectable } from '@nestjs/common';

import { User } from '@application/entities/user';
import { Message } from '@application/entities/message';
import { Conversation } from '@application/entities/conversation';

import { Either } from '@helpers/Either';

import { IMessageViewModel } from '@infra/http/view-model/message-view-model';

@Injectable()
export abstract class MessageRepository {
  abstract create(message: Message): Promise<Either<Error, void>>;
  abstract updateStatus(messageId: Message['id'], status: 'read' | 'received' | 'sent'): Promise<Either<Error, void>>;
  abstract readUnreadMessagedByConversationId(userId: User['_id'], conversationId: Conversation['_id']): Promise<Either<Error, void>>;
  abstract getUnreadConversationMessagesCount(userId: User['_id'], conversationId: Conversation['_id']): Promise<Either<Error, number>>;
  abstract getMessagesFromConversation(conversationId: Conversation['_id'], quantity: number): Promise<Either<Error, IMessageViewModel[]>>;
}
