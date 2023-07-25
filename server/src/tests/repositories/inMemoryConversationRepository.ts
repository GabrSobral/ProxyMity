import { Conversation } from '@application/entities/conversation';
import { ConversationRepository } from '@application/repositories/conversation-repository';

import { Either, right } from '@helpers/Either';

export class InMemoryConversationRepository implements ConversationRepository {
  public items: Conversation[];

  constructor() {
    this.items = [];
  }

  async create(newConversation: Conversation): Promise<Either<Error, void>> {
    this.items.push(newConversation);

    return right(void 0);
  }

  async disableConversationById(conversationId: string): Promise<Either<Error, void>> {
    this.items = this.items.map(item => {
      if (item.id === conversationId) {
        item.disable();
      }
      return item;
    });

    return right(void 0);
  }

  async getById(conversationId: string): Promise<Either<Error, Conversation | null>> {
    const conversation = this.items.find(item => item.id === conversationId);

    return right(conversation || null);
  }
}
