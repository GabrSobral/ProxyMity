import { MessageStatus } from '@application/entities/message-status';
import { MessageStatusRepository } from '@application/repositories/message-status-repository';

import { Either, right } from '@helpers/Either';

export class InMemoryMessageStatusRepository implements MessageStatusRepository {
  public items: MessageStatus[] = [];

  async create(messageStatus: MessageStatus): Promise<Either<Error, void>> {
    this.items.push(messageStatus);

    return right(void 0);
  }

  async readUnreadMessagesByUserId(userId: string): Promise<Either<Error, void>> {
    this.items = this.items.map(item => {
      if (item.userId === userId) {
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
}