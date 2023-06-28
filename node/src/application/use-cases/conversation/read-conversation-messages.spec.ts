import { describe, it } from 'vitest';

import { ReadConversationMessagesUseCase } from './read-conversation-messages';

import { InMemoryMessagesRepository } from 'src/tests/repositories/inMemoryMessagesRepository';
import { InMemoryConversationRepository } from 'src/tests/repositories/inMemoryConversationRepository';
import { InMemoryMessageStatusRepository } from 'src/tests/repositories/inMemoryMessageStatusRepository';

describe('ReadConversationMessagesUseCase', () => {
  it('should be able to read all messages from conversation', async () => {
    const inMemoryMessagesRepository = new InMemoryMessagesRepository();
    const inMemoryConversationRepository = new InMemoryConversationRepository();
    const inMemoryMessageStatusRepository = new InMemoryMessageStatusRepository();

    const readConversationMessagesUseCase = new ReadConversationMessagesUseCase(
      inMemoryMessagesRepository,
      inMemoryConversationRepository,
      inMemoryMessageStatusRepository,
    );
  });
});
