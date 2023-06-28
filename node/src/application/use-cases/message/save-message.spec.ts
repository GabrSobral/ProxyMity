import { describe, expect, it } from 'vitest';

import { User } from '@application/entities/user';
import { Message } from '@application/entities/message';
import { Participant } from '@application/entities/participant';
import { Conversation } from '@application/entities/conversation';

import { SaveMessageUseCase } from './save-message';

import { InMemoryMessagesRepository } from 'src/tests/repositories/inMemoryMessagesRepository';
import { InMemoryParticipantRepository } from 'src/tests/repositories/inMemoryParticipantRepository';
import { InMemoryConversationRepository } from 'src/tests/repositories/inMemoryConversationRepository';
import { InMemoryMessageStatusRepository } from 'src/tests/repositories/inMemoryMessageStatusRepository';

describe('SaveMessageUseCase', () => {
  it('should be able to save a private message', async () => {
    const inMemoryMessagesRepository = new InMemoryMessagesRepository();
    const inMemoryParticipantRepository = new InMemoryParticipantRepository();
    const inMemoryConversationRepository = new InMemoryConversationRepository();
    const inMemoryMessageStatusRepository = new InMemoryMessageStatusRepository();

    const saveMessageUseCase = new SaveMessageUseCase(
      inMemoryMessagesRepository,
      inMemoryParticipantRepository,
      inMemoryConversationRepository,
      inMemoryMessageStatusRepository,
    );

    const user1 = User.create({ email: 'email1@gmail.com', name: 'Test1', password: '123' });
    const user2 = User.create({ email: 'email2@gmail.com', name: 'Test2', password: '123' });

    const conversation = Conversation.create({ isGroup: false });

    const participant1 = Participant.create({ userId: user1.id, conversationId: conversation.id });
    const participant2 = Participant.create({ userId: user2.id, conversationId: conversation.id });

    inMemoryParticipantRepository.add(participant1);
    inMemoryParticipantRepository.add(participant2);

    await inMemoryConversationRepository.create(conversation);

    const message1 = Message.create({
      authorId: user1.id,
      content: 'Message Content',
      conversationId: conversation.id,
    });

    await saveMessageUseCase.execute({ message: message1 });

    expect(inMemoryMessagesRepository.items).toHaveLength(1);
    expect(inMemoryParticipantRepository.items).toHaveLength(2);
    expect(inMemoryConversationRepository.items).toHaveLength(1);
    expect(inMemoryMessageStatusRepository.items).toHaveLength(0);
  });

  it('should be able to save a group message', async () => {
    const inMemoryMessagesRepository = new InMemoryMessagesRepository();
    const inMemoryParticipantRepository = new InMemoryParticipantRepository();
    const inMemoryConversationRepository = new InMemoryConversationRepository();
    const inMemoryMessageStatusRepository = new InMemoryMessageStatusRepository();

    const saveMessageUseCase = new SaveMessageUseCase(
      inMemoryMessagesRepository,
      inMemoryParticipantRepository,
      inMemoryConversationRepository,
      inMemoryMessageStatusRepository,
    );

    const user1 = User.create({ email: 'email1@gmail.com', name: 'Test1', password: '123' });
    const user2 = User.create({ email: 'email2@gmail.com', name: 'Test2', password: '123' });
    const user3 = User.create({ email: 'email3@gmail.com', name: 'Test2', password: '123' });

    const conversation = Conversation.create({ isGroup: true, groupId: 'groupTest' });

    const participant1 = Participant.create({ userId: user1.id, conversationId: conversation.id });
    const participant2 = Participant.create({ userId: user2.id, conversationId: conversation.id });
    const participant3 = Participant.create({ userId: user3.id, conversationId: conversation.id });

    inMemoryParticipantRepository.add(participant1);
    inMemoryParticipantRepository.add(participant2);
    inMemoryParticipantRepository.add(participant3);

    await inMemoryConversationRepository.create(conversation);

    const message1 = Message.create({
      authorId: user1.id,
      content: 'Message Content',
      conversationId: conversation.id,
    });

    await saveMessageUseCase.execute({ message: message1 });

    expect(inMemoryMessagesRepository.items).toHaveLength(1);
    expect(inMemoryParticipantRepository.items).toHaveLength(3);
    expect(inMemoryConversationRepository.items).toHaveLength(1);
    expect(inMemoryMessageStatusRepository.items).toHaveLength(2);
  });
});
