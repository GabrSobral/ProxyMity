import { describe, it } from 'vitest';

import { CreateGroupUseCase } from './create-group';

import { User } from '@application/entities/user';

import { InMemoryGroupRepository } from 'src/tests/repositories/inMemoryGroupRepository';
import { InMemoryParticipantRepository } from 'src/tests/repositories/inMemoryParticipantRepository';
import { InMemoryConversationRepository } from 'src/tests/repositories/inMemoryConversationRepository';

describe('CreateGroupUseCase', () => {
  it('should be able to create a group', async () => {
    const inMemoryGroupRepository = new InMemoryGroupRepository();
    const inMemoryParticipantRepository = new InMemoryParticipantRepository();
    const inMemoryConversationRepository = new InMemoryConversationRepository();

    const createGroupUseCase = new CreateGroupUseCase(
      inMemoryGroupRepository,
      inMemoryParticipantRepository,
      inMemoryConversationRepository,
    );

    const user1 = User.create({ name: 'Test1', email: 'email1@gmail.com', password: '123' });
    const user2 = User.create({ name: 'Test2', email: 'email2@gmail.com', password: '123' });
    const user3 = User.create({ name: 'Test3', email: 'email3@gmail.com', password: '123' });
    const user4 = User.create({ name: 'Test4', email: 'email4@gmail.com', password: '123' });

    const participants = [user1.id, user2.id, user3.id, user4.id];

    await createGroupUseCase.execute({
      name: 'Group Name',
      description: 'Group Description',
      participants: participants,
    });
  });
});
