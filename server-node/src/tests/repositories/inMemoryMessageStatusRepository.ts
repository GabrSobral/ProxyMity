import { User } from '@application/entities/user';
import { Conversation } from '@application/entities/conversation';
import { MessageStatus } from '@application/entities/message-status';

import { MessageStatusRepository } from '@application/repositories/message-status-repository';

import { Either, right } from '@helpers/Either';

export class InMemoryMessageStatusRepository implements MessageStatusRepository {
  public items: MessageStatus[] = [];

  async create(messageStatus: MessageStatus): Promise<Either<Error, void>> {
    this.items.push(messageStatus);

    return right(void 0);
  }

  async readUnreadMessagesByUserId(userId: User['_id'], conversationId: Conversation['_id']): Promise<Either<Error, void>> {
    this.items = this.items.map(item => {
      if (item.userId === userId && item.conversationId === conversationId) {
        item.read();
      }

      return item;
    });

    return right(void 0);
  }

  async receive(props: { userId: string; messageId: string }): Promise<Either<Error, void>> {
    const { messageId, userId } = props;

    this.items = this.items.map(item => {
      if (item.messageId === messageId && item.userId === userId) {
        item.receive();
      }

      return item;
    });

    return right(void 0);
  }

  async read(props: { userId: string; messageId: string }): Promise<Either<Error, void>> {
    const { messageId, userId } = props;

    this.items = this.items.map(item => {
      if (item.messageId === messageId && item.userId === userId) {
        item.read();
      }

      return item;
    });

    return right(void 0);
  }

  async getUnreadMessagesStatusFromConversationById(conversationId: string): Promise<Either<Error, MessageStatus[]>> {
    const unreadMessageStatus = this.items.filter(item => item.conversationId === conversationId && !item.readAt);
    return right(unreadMessageStatus);
  }

  async getUnreadMessagesStatusCountByUserId(userId: string, conversationId: string): Promise<Either<Error, number>> {
    const unreadMessageStatusCount = this.items.filter(
      item => item.userId === userId && item.conversationId === conversationId && !item.readAt,
    ).length;

    return right(unreadMessageStatusCount);
  }

  async getMessagesStatusByMessageId(messageId: string, conversationId: string): Promise<Either<Error, MessageStatus[]>> {
    const toReadMessageStatus = this.items.filter(item => item.messageId === messageId && item.conversationId === conversationId);

    return right(toReadMessageStatus);
  }
}
