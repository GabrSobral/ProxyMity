import { User } from '@application/entities/user';
import { Conversation } from '@application/entities/conversation';
import { MessageStatus } from '@application/entities/message-status';

import { Either } from '@helpers/Either';

export interface MessageStatusRepository {
  create(messageStatus: MessageStatus): Promise<Either<Error, void>>;
  receive(props: {
    userId: MessageStatus['userId'];
    messageId: MessageStatus['messageId'];
  }): Promise<Either<Error, void>>;
  read(props: { userId: MessageStatus['userId']; messageId: MessageStatus['messageId'] }): Promise<Either<Error, void>>;

  readUnreadMessagesByUserId(conversationId: User['_id']): Promise<Either<Error, void>>;
  getToReadMessagesStatusByUserId(
    userId: User['_id'],
    conversationId: Conversation['_id'],
  ): Promise<Either<Error, MessageStatus[]>>;
  getToReceiveMessagesStatusByUserId(
    userId: User['_id'],
    conversationId: Conversation['_id'],
  ): Promise<Either<Error, MessageStatus[]>>;
}
