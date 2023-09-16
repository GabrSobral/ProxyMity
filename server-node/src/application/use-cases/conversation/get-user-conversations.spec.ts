import { describe, expect, it } from 'vitest';

import { User } from '@application/entities/user';
import { Group } from '@application/entities/group';
import { Message } from '@application/entities/message';
import { Participant } from '@application/entities/participant';
import { Conversation } from '@application/entities/conversation';
import { MessageStatus } from '@application/entities/message-status';

import { InMemoryUserRepository } from 'src/tests/repositories/inMemoryUserRepository';
import { InMemoryGroupRepository } from 'src/tests/repositories/inMemoryGroupRepository';
import { InMemoryMessagesRepository } from 'src/tests/repositories/inMemoryMessagesRepository';
import { InMemoryParticipantRepository } from 'src/tests/repositories/inMemoryParticipantRepository';
import { InMemoryConversationRepository } from 'src/tests/repositories/inMemoryConversationRepository';
import { InMemoryMessageStatusRepository } from 'src/tests/repositories/inMemoryMessageStatusRepository';

import { GetUserConversationsUseCase } from './get-user-conversations';

describe('GetUserConversationsUseCase', () => {
  it('should be able to get user conversation with all participants', async () => {
    const inMemoryUserRepository = new InMemoryUserRepository();
    const inMemoryGroupRepository = new InMemoryGroupRepository();
    const inMemoryMessagesRepository = new InMemoryMessagesRepository();
    const inMemoryParticipantRepository = new InMemoryParticipantRepository();
    const inMemoryConversationRepository = new InMemoryConversationRepository();
    const inMemoryMessageStatusRepository = new InMemoryMessageStatusRepository();

    const user1 = User.create({ name: 'User 1', email: 'user1@email.com', password: '123' });
    const user2 = User.create({ name: 'User 2', email: 'user2@email.com', password: '123' });
    inMemoryUserRepository.items.push(user1);
    inMemoryUserRepository.items.push(user2);

    const conversation = Conversation.create({ isGroup: false });
    inMemoryConversationRepository.items.push(conversation);

    const participationUser1 = Participant.create({ conversationId: conversation.id, userId: user1.id });
    const participationUser2 = Participant.create({ conversationId: conversation.id, userId: user2.id });
    inMemoryParticipantRepository.items.push(participationUser1);
    inMemoryParticipantRepository.items.push(participationUser2);

    inMemoryParticipantRepository.setUserRepository(inMemoryUserRepository);
    inMemoryParticipantRepository.setGroupRepository(inMemoryGroupRepository);
    inMemoryParticipantRepository.setConversationRepository(inMemoryConversationRepository);

    const getUserConversationsUseCase = new GetUserConversationsUseCase(
      inMemoryParticipantRepository,
      inMemoryMessagesRepository,
      inMemoryMessageStatusRepository,
    );

    const result = await getUserConversationsUseCase.execute({ userId: user1.id });

    if (result.isLeft()) throw result.value;

    expect(result.value).toHaveLength(1);
    expect(result.value[0].participants).toHaveLength(2);
    expect(result.value[0].isGroup).not.toBeTruthy();
    expect(result.value[0].groupName).not.toBeTruthy();
  });

  it('should be able to get all user conversations with all participants', async () => {
    const inMemoryUserRepository = new InMemoryUserRepository();
    const inMemoryGroupRepository = new InMemoryGroupRepository();
    const inMemoryMessagesRepository = new InMemoryMessagesRepository();
    const inMemoryParticipantRepository = new InMemoryParticipantRepository();
    const inMemoryConversationRepository = new InMemoryConversationRepository();
    const inMemoryMessageStatusRepository = new InMemoryMessageStatusRepository();

    const user1 = User.create({ name: 'User 1', email: 'user1@email.com', password: '123' });
    const user2 = User.create({ name: 'User 2', email: 'user2@email.com', password: '123' });
    const user3 = User.create({ name: 'User 3', email: 'user3@email.com', password: '123' });
    const user4 = User.create({ name: 'User 4', email: 'user4@email.com', password: '123' });
    inMemoryUserRepository.items.push(user1);
    inMemoryUserRepository.items.push(user2);
    inMemoryUserRepository.items.push(user3);
    inMemoryUserRepository.items.push(user4);

    const group = Group.create({ name: 'ProxyMity test', conversation: null, description: '' });
    inMemoryGroupRepository.items.push(group);

    const conversationPrivate = Conversation.create({ isGroup: false });
    const conversationGroup = Conversation.create({ isGroup: true, groupId: group.id });
    inMemoryConversationRepository.items.push(conversationPrivate);
    inMemoryConversationRepository.items.push(conversationGroup);

    const participationUser1 = Participant.create({ conversationId: conversationPrivate.id, userId: user1.id });
    const participationUser2 = Participant.create({ conversationId: conversationPrivate.id, userId: user2.id });

    const participationUser1Group = Participant.create({ conversationId: conversationGroup.id, userId: user1.id });
    const participationUser3group = Participant.create({ conversationId: conversationGroup.id, userId: user3.id });
    const participationUser4Group = Participant.create({ conversationId: conversationGroup.id, userId: user4.id });

    inMemoryParticipantRepository.items.push(participationUser1);
    inMemoryParticipantRepository.items.push(participationUser2);
    inMemoryParticipantRepository.items.push(participationUser1Group);
    inMemoryParticipantRepository.items.push(participationUser3group);
    inMemoryParticipantRepository.items.push(participationUser4Group);

    inMemoryParticipantRepository.setUserRepository(inMemoryUserRepository);
    inMemoryParticipantRepository.setGroupRepository(inMemoryGroupRepository);
    inMemoryParticipantRepository.setConversationRepository(inMemoryConversationRepository);

    const getUserConversationsUseCase = new GetUserConversationsUseCase(
      inMemoryParticipantRepository,
      inMemoryMessagesRepository,
      inMemoryMessageStatusRepository,
    );
    const result = await getUserConversationsUseCase.execute({ userId: user1.id });

    if (result.isLeft()) throw result.value;

    expect(result.value).toHaveLength(2);

    expect(result.value[0].participants).toHaveLength(2);
    expect(result.value[0].isGroup).not.toBeTruthy();
    expect(result.value[0].groupName).not.toBeTruthy();

    expect(result.value[1].participants).toHaveLength(3);
    expect(result.value[1].isGroup).toBeTruthy();
    expect(result.value[1].groupName).toBeTruthy();
  });

  it('should be able to get all user conversations with an empty array when user do not participate of any conversation', async () => {
    const inMemoryUserRepository = new InMemoryUserRepository();
    const inMemoryGroupRepository = new InMemoryGroupRepository();
    const inMemoryMessagesRepository = new InMemoryMessagesRepository();
    const inMemoryParticipantRepository = new InMemoryParticipantRepository();
    const inMemoryConversationRepository = new InMemoryConversationRepository();
    const inMemoryMessageStatusRepository = new InMemoryMessageStatusRepository();

    const user1 = User.create({ name: 'User 1', email: 'user1@email.com', password: '123' });
    const user2 = User.create({ name: 'User 2', email: 'user2@email.com', password: '123' });
    const user3 = User.create({ name: 'User 3', email: 'user3@email.com', password: '123' });
    const user4 = User.create({ name: 'User 4', email: 'user4@email.com', password: '123' });
    const user5 = User.create({ name: 'User 4', email: 'user4@email.com', password: '123' });
    inMemoryUserRepository.items.push(user1);
    inMemoryUserRepository.items.push(user2);
    inMemoryUserRepository.items.push(user3);
    inMemoryUserRepository.items.push(user4);

    const group = Group.create({ name: 'ProxyMity test', conversation: null, description: '' });
    inMemoryGroupRepository.items.push(group);

    const conversationPrivate = Conversation.create({ isGroup: false });
    const conversationGroup = Conversation.create({ isGroup: true, groupId: group.id });
    inMemoryConversationRepository.items.push(conversationPrivate);
    inMemoryConversationRepository.items.push(conversationGroup);

    const participationUser1 = Participant.create({ conversationId: conversationPrivate.id, userId: user1.id });
    const participationUser2 = Participant.create({ conversationId: conversationPrivate.id, userId: user2.id });

    const participationUser1Group = Participant.create({ conversationId: conversationGroup.id, userId: user1.id });
    const participationUser3group = Participant.create({ conversationId: conversationGroup.id, userId: user3.id });
    const participationUser4Group = Participant.create({ conversationId: conversationGroup.id, userId: user4.id });

    inMemoryParticipantRepository.items.push(participationUser1);
    inMemoryParticipantRepository.items.push(participationUser2);
    inMemoryParticipantRepository.items.push(participationUser1Group);
    inMemoryParticipantRepository.items.push(participationUser3group);
    inMemoryParticipantRepository.items.push(participationUser4Group);

    inMemoryParticipantRepository.setUserRepository(inMemoryUserRepository);
    inMemoryParticipantRepository.setGroupRepository(inMemoryGroupRepository);
    inMemoryParticipantRepository.setConversationRepository(inMemoryConversationRepository);

    const getUserConversationsUseCase = new GetUserConversationsUseCase(
      inMemoryParticipantRepository,
      inMemoryMessagesRepository,
      inMemoryMessageStatusRepository,
    );
    const result = await getUserConversationsUseCase.execute({ userId: user5.id });

    if (result.isLeft()) throw result.value;

    expect(result.value).toHaveLength(0);
  });

  it('should be able to get all user conversations with all participants and the last three messages', async () => {
    const inMemoryUserRepository = new InMemoryUserRepository();
    const inMemoryGroupRepository = new InMemoryGroupRepository();
    const inMemoryMessagesRepository = new InMemoryMessagesRepository();
    const inMemoryParticipantRepository = new InMemoryParticipantRepository();
    const inMemoryConversationRepository = new InMemoryConversationRepository();
    const inMemoryMessageStatusRepository = new InMemoryMessageStatusRepository();

    const user1 = User.create({ name: 'User 1', email: 'user1@email.com', password: '123' });
    const user2 = User.create({ name: 'User 2', email: 'user2@email.com', password: '123' });
    const user3 = User.create({ name: 'User 3', email: 'user3@email.com', password: '123' });
    const user4 = User.create({ name: 'User 4', email: 'user4@email.com', password: '123' });
    inMemoryUserRepository.items.push(user1);
    inMemoryUserRepository.items.push(user2);
    inMemoryUserRepository.items.push(user3);
    inMemoryUserRepository.items.push(user4);

    const group = Group.create({ name: 'ProxyMity test', conversation: null, description: '' });
    inMemoryGroupRepository.items.push(group);

    const conversationPrivate = Conversation.create({ isGroup: false });
    const conversationGroup = Conversation.create({ isGroup: true, groupId: group.id });
    inMemoryConversationRepository.items.push(conversationPrivate);
    inMemoryConversationRepository.items.push(conversationGroup);

    const participationUser1 = Participant.create({ conversationId: conversationPrivate.id, userId: user1.id });
    const participationUser2 = Participant.create({ conversationId: conversationPrivate.id, userId: user2.id });

    const participationUser1Group = Participant.create({ conversationId: conversationGroup.id, userId: user1.id });
    const participationUser3group = Participant.create({ conversationId: conversationGroup.id, userId: user3.id });
    const participationUser4Group = Participant.create({ conversationId: conversationGroup.id, userId: user4.id });
    inMemoryParticipantRepository.items.push(participationUser1);
    inMemoryParticipantRepository.items.push(participationUser2);
    inMemoryParticipantRepository.items.push(participationUser1Group);
    inMemoryParticipantRepository.items.push(participationUser3group);
    inMemoryParticipantRepository.items.push(participationUser4Group);

    const message1ToConversation1 = Message.create({
      content: 'Message 1',
      authorId: user1.id,
      conversationId: conversationPrivate.id,
    });
    const message2ToConversation1 = Message.create({
      content: 'Message 2',
      authorId: user1.id,
      conversationId: conversationPrivate.id,
    });
    const message3ToConversation1 = Message.create({
      content: 'Message 2',
      authorId: user1.id,
      conversationId: conversationPrivate.id,
    });
    const message4ToConversation1 = Message.create({
      content: 'Message 2',
      authorId: user1.id,
      conversationId: conversationPrivate.id,
    });

    inMemoryMessagesRepository.items.push(message1ToConversation1);
    inMemoryMessagesRepository.items.push(message2ToConversation1);
    inMemoryMessagesRepository.items.push(message3ToConversation1);
    inMemoryMessagesRepository.items.push(message4ToConversation1);

    inMemoryParticipantRepository.setUserRepository(inMemoryUserRepository);
    inMemoryParticipantRepository.setGroupRepository(inMemoryGroupRepository);
    inMemoryParticipantRepository.setConversationRepository(inMemoryConversationRepository);

    const getUserConversationsUseCase = new GetUserConversationsUseCase(
      inMemoryParticipantRepository,
      inMemoryMessagesRepository,
      inMemoryMessageStatusRepository,
    );
    const result = await getUserConversationsUseCase.execute({ userId: user1.id });

    if (result.isLeft()) throw result.value;

    expect(result.value).toHaveLength(2);

    expect(result.value[0].participants).toHaveLength(2);
    expect(result.value[0].isGroup).not.toBeTruthy();
    expect(result.value[0].groupName).not.toBeTruthy();

    expect(result.value[0].lastMessages).toHaveLength(3);
    expect(result.value[0].lastMessages[0].id).toEqual(message4ToConversation1.id);

    expect(result.value[1].participants).toHaveLength(3);
    expect(result.value[1].isGroup).toBeTruthy();
    expect(result.value[1].groupName).toBeTruthy();
  });
});
