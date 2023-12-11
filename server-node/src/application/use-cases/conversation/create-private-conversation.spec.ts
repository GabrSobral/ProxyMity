import { describe, expect, it } from 'vitest';

import { CreatePrivateConversationUseCase } from './create-private-conversation';

import { InMemoryParticipantRepository } from 'src/tests/repositories/inMemoryParticipantRepository';
import { InMemoryConversationRepository } from 'src/tests/repositories/inMemoryConversationRepository';

describe('Create Conversation Use Case', () => {
  it('should be able to create a conversation with two users', async () => {
    const inMemoryParticipantRepository = new InMemoryParticipantRepository();
    const inMemoryConversationRepository = new InMemoryConversationRepository();

    const createConversationUseCase = new CreatePrivateConversationUseCase(inMemoryParticipantRepository, inMemoryConversationRepository);

    await createConversationUseCase.execute({
      participants: ['user-one-id', 'user-two-id'],
    });

    expect(inMemoryConversationRepository.items, 'Conversation Repository items').toHaveLength(1);
    expect(inMemoryParticipantRepository.items, 'Participant Repository items').toHaveLength(2);
  });

  it('should not be able to create a conversation with more than two users', async () => {
    const inMemoryParticipantRepository = new InMemoryParticipantRepository();
    const inMemoryConversationRepository = new InMemoryConversationRepository();

    const createConversationUseCase = new CreatePrivateConversationUseCase(inMemoryParticipantRepository, inMemoryConversationRepository);

    const result = await createConversationUseCase.execute({
      participants: ['user-one-id', 'user-two-id', 'user-two-id'],
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(Error);

    expect(inMemoryConversationRepository.items, 'Conversation Repository items').toHaveLength(0);
    expect(inMemoryParticipantRepository.items, 'Participant Repository items').toHaveLength(0);
  });

  it('should not be able to create a conversation with less than two users', async () => {
    const inMemoryParticipantRepository = new InMemoryParticipantRepository();
    const inMemoryConversationRepository = new InMemoryConversationRepository();

    const createConversationUseCase = new CreatePrivateConversationUseCase(inMemoryParticipantRepository, inMemoryConversationRepository);

    const result = await createConversationUseCase.execute({
      participants: ['user-one-id'],
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(Error);

    expect(inMemoryConversationRepository.items, 'Conversation Repository items').toHaveLength(0);
    expect(inMemoryParticipantRepository.items, 'Participant Repository items').toHaveLength(0);
  });
});
