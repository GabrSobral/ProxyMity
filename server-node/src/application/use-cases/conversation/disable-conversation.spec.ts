import { describe, expect, it } from 'vitest';

import { Conversation } from '@application/entities/conversation';

import { InMemoryConversationRepository } from 'src/tests/repositories/inMemoryConversationRepository';
import { DisableConversationUseCase } from './disable-conversation';

describe('DisableConversationUseCase', () => {
  it('should be able to disable a conversation', async () => {
    const inMemoryConversationRepository = new InMemoryConversationRepository();
    const conversation1 = Conversation.create({ isGroup: false });

    await inMemoryConversationRepository.create(conversation1);

    const disableConversationUseCase = new DisableConversationUseCase(inMemoryConversationRepository);
    const result = await disableConversationUseCase.execute({ conversationId: conversation1.id });

    const databaseConversation1 = await inMemoryConversationRepository.getById(conversation1.id);

    if (databaseConversation1.isRight() && databaseConversation1.value) {
      expect(databaseConversation1.value.disabledAt).toBeTruthy();
      expect(databaseConversation1.value).not.toBeNull();
    } else {
      throw new Error('Error on try to get conversation');
    }

    expect(result.isRight()).toBeTruthy();
  });

  it('should not be able to disable a conversation with an invalid id', async () => {
    const inMemoryConversationRepository = new InMemoryConversationRepository();

    const disableConversationUseCase = new DisableConversationUseCase(inMemoryConversationRepository);
    const result = await disableConversationUseCase.execute({ conversationId: 'conversation1.id' });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(Error);
  });
});
