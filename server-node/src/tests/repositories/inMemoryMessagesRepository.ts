import { Conversation } from '@application/entities/conversation';
import { Message } from '@application/entities/message';
import { User } from '@application/entities/user';
import { MessageRepository } from '@application/repositories/message-repository';

import { Either, right } from '@helpers/Either';
import { IMessageViewModel, MessageViewModel } from '@infra/http/view-model/message-view-model';

export class InMemoryMessagesRepository implements MessageRepository {
  public items: Message[] = [];

  async getMessagesFromConversation(conversationId: Conversation['_id'], quantity: number): Promise<Either<Error, IMessageViewModel[]>> {
    const messagesFromConversation = this.items.filter(item => item.conversationId === conversationId);
    const orderedMessages = messagesFromConversation.sort((current, prev) => Number(current.writtenAt) - Number(prev.writtenAt));
    const lastMessages = orderedMessages
      .reverse()
      .slice(0, quantity)
      .map<IMessageViewModel>(item => ({
        id: item.id,
        authorId: item.authorId,
        content: item.content,
        conversationId: item.conversationId,
        readByAllAt: item.readAt,
        receivedByAllAt: item.receivedAt,
        repliedMessageId: item.repliedMessageId,
        sentAt: item.sentAt,
        writtenAt: item.writtenAt,
      }));

    return right(lastMessages);
  }

  async getUnreadConversationMessagesCount(conversationId: string): Promise<Either<Error, number>> {
    let unreadCounter = 0;

    return right(unreadCounter);
  }

  async create(message: Message): Promise<Either<Error, void>> {
    this.items.push(message);

    return right(void 0);
  }

  async readUnreadMessagedByConversationId(userId: User['_id'], conversationId: string): Promise<Either<Error, void>> {
    this.items = this.items.map(item => {
      if (item.conversationId === conversationId && item.authorId !== userId) {
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
