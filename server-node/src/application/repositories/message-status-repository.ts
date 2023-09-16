import { Injectable } from '@nestjs/common';

import { User } from '@application/entities/user';
import { Message } from '@application/entities/message';
import { Conversation } from '@application/entities/conversation';
import { MessageStatus } from '@application/entities/message-status';

import { Either } from '@helpers/Either';

@Injectable()
export abstract class MessageStatusRepository {
  abstract create(messageStatus: MessageStatus): Promise<Either<Error, void>>;

  abstract receive(props: {
    userId: MessageStatus['userId'];
    messageId: MessageStatus['messageId'];
  }): Promise<Either<Error, void>>;

  abstract read(props: {
    userId: MessageStatus['userId'];
    messageId: MessageStatus['messageId'];
  }): Promise<Either<Error, void>>;

  abstract readUnreadMessagesByUserId(
    userId: User['_id'],
    conversationId: Conversation['_id'],
  ): Promise<Either<Error, void>>;

  abstract getUnreadMessagesStatusFromConversationById(
    conversationId: Conversation['_id'],
  ): Promise<Either<Error, MessageStatus[]>>;

  abstract getUnreadMessagesStatusCountByUserId(userId: string, conversationId: string): Promise<Either<Error, number>>;

  abstract getMessagesStatusByMessageId(
    messageId: Message['_id'],
    conversationId: Conversation['_id'],
  ): Promise<Either<Error, MessageStatus[]>>;
}
