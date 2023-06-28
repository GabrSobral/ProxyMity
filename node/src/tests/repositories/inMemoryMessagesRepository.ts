import { Message } from '@application/entities/message';
import { MessageRepository } from '@application/repositories/message-repository';

import { Either, right } from '@helpers/Either';

export class InMemoryMessagesRepository implements MessageRepository {
  public items: Message[] = [];

  async create(message: Message): Promise<Either<Error, void>> {
    this.items.push(message);

    return right(void 0);
  }

  async readUnreadMessagedByConversationId(conversationId: string): Promise<Either<Error, void>> {
    this.items = this.items.map(item => {
      if (item.conversationId === conversationId) {
        item.read();
      }

      return item;
    });

    return right(void 0);
  }

  async updateStatus(messageId: string, status: 'read' | 'received' | 'sent'): Promise<Either<Error, void>> {
    this.items = this.items.map(item => {
      if (item.id === messageId) {
        const options = {
          sent: () => item.send(),
          received: () => item.receive(),
          read: () => item.read(),
        };

        options[status]();
      }

      return item;
    });

    return right(void 0);
  }
}
