import { describe, expect, it } from 'vitest';

import { User } from '@application/entities/user';
import { Participant } from '@application/entities/participant';

import { GetUserConversationsIdUseCase } from './get-user-conversations-id';

import { InMemoryParticipantRepository } from 'src/tests/repositories/inMemoryParticipantRepository';

describe('GetUserConversationsIdUseCase', () => {
  it('should be able to get all user conversations', async () => {
    const inMemoryParticipantRepository = new InMemoryParticipantRepository();

    const user1 = User.create({ email: 'user1@gmail.com', name: 'User1', password: '123' });
    const user2 = User.create({ email: 'user2@gmail.com', name: 'User2', password: '123' });
    const user3 = User.create({ email: 'user3@gmail.com', name: 'User3', password: '123' });

    const participantUser1ToConversation1 = Participant.create({
      conversationId: 'conversation1',
      userId: user1.id,
    });
    const participantUser2ToConversation1 = Participant.create({
      conversationId: 'conversation1',
      userId: user2.id,
    });

    inMemoryParticipantRepository.add(participantUser1ToConversation1);
    inMemoryParticipantRepository.add(participantUser2ToConversation1);

    const participantUser1ToConversation2 = Participant.create({
      conversationId: 'conversation2',
      userId: user1.id,
    });
    const participantUser2ToConversation2 = Participant.create({
      conversationId: 'conversation2',
      userId: user2.id,
    });
    const participantUser3ToConversation2 = Participant.create({
      conversationId: 'conversation2',
      userId: user3.id,
    });

    inMemoryParticipantRepository.add(participantUser1ToConversation2);
    inMemoryParticipantRepository.add(participantUser2ToConversation2);
    inMemoryParticipantRepository.add(participantUser3ToConversation2);

    const getUserConversationsUseCase = new GetUserConversationsIdUseCase(inMemoryParticipantRepository);

    const user1Conversations = await getUserConversationsUseCase.execute({ userId: user1.id });
    const user2Conversations = await getUserConversationsUseCase.execute({ userId: user2.id });
    const user3Conversations = await getUserConversationsUseCase.execute({ userId: user3.id });

    if (user1Conversations.isLeft()) throw user1Conversations.value;
    if (user2Conversations.isLeft()) throw user2Conversations.value;
    if (user3Conversations.isLeft()) throw user3Conversations.value;

    expect(user1Conversations.value.conversationsId).toHaveLength(2);
    expect(user2Conversations.value.conversationsId).toHaveLength(2);
    expect(user3Conversations.value.conversationsId).toHaveLength(1);
  });

  it('should not be able to get conversations with invalid userId', async () => {
    const inMemoryParticipantRepository = new InMemoryParticipantRepository();
    const getUserConversationsUseCase = new GetUserConversationsIdUseCase(inMemoryParticipantRepository);

    const userConversations = await getUserConversationsUseCase.execute({ userId: '123' });

    expect(userConversations.isRight()).not.toBeTruthy();
  });
});
