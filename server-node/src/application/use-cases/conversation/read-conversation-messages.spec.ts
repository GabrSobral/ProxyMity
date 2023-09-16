import { describe, expect, it } from 'vitest';

import { ReadConversationMessagesUseCase } from './read-conversation-messages';

import { User } from '@application/entities/user';
import { Message } from '@application/entities/message';
import { Conversation } from '@application/entities/conversation';

import { InMemoryMessagesRepository } from 'src/tests/repositories/inMemoryMessagesRepository';
import { InMemoryConversationRepository } from 'src/tests/repositories/inMemoryConversationRepository';
import { InMemoryMessageStatusRepository } from 'src/tests/repositories/inMemoryMessageStatusRepository';
import { Group } from '@application/entities/group';
import { MessageStatus } from '@application/entities/message-status';

describe('ReadConversationMessagesUseCase', () => {
  it('should be able to read all messages from private conversation', async () => {
    const inMemoryMessagesRepository = new InMemoryMessagesRepository();
    const inMemoryConversationRepository = new InMemoryConversationRepository();
    const inMemoryMessageStatusRepository = new InMemoryMessageStatusRepository();

    const bob = User.create({ email: 'bob@email.com', name: 'Bob', password: '123' });
    const alice = User.create({ email: 'alice@email.com', name: 'Alice', password: '123' });
    const george = User.create({ email: 'george@email.com', name: 'Bob', password: '123' });
    const michael = User.create({ email: 'michael@email.com', name: 'Alice', password: '123' });

    const chatBetweenBobAndAlice = Conversation.create({ isGroup: false });
    const chatBetweenGeorgeAndMichael = Conversation.create({ isGroup: false });

    inMemoryConversationRepository.items.push(chatBetweenBobAndAlice);
    inMemoryConversationRepository.items.push(chatBetweenGeorgeAndMichael);

    const message1 = Message.create({ authorId: bob.id, content: 'Hello', conversationId: chatBetweenBobAndAlice.id });
    const message2 = Message.create({ authorId: bob.id, content: 'World', conversationId: chatBetweenBobAndAlice.id });
    const message3 = Message.create({ authorId: bob.id, content: 'Test', conversationId: chatBetweenBobAndAlice.id });
    const message4 = Message.create({ authorId: george.id, content: 'Hello', conversationId: chatBetweenGeorgeAndMichael.id });
    const message5 = Message.create({ authorId: george.id, content: 'World', conversationId: chatBetweenGeorgeAndMichael.id });
    const message6 = Message.create({ authorId: george.id, content: 'Test', conversationId: chatBetweenGeorgeAndMichael.id });

    inMemoryMessagesRepository.items.push(message1);
    inMemoryMessagesRepository.items.push(message2);
    inMemoryMessagesRepository.items.push(message3);
    inMemoryMessagesRepository.items.push(message4);
    inMemoryMessagesRepository.items.push(message5);
    inMemoryMessagesRepository.items.push(message6);

    const readConversationMessagesUseCase = new ReadConversationMessagesUseCase(
      inMemoryMessagesRepository,
      inMemoryConversationRepository,
      inMemoryMessageStatusRepository,
    );

    inMemoryMessagesRepository.items.forEach(message => {
      expect(message.readAt).not.toBeTruthy();
    });

    await readConversationMessagesUseCase.execute({
      conversationId: chatBetweenBobAndAlice.id,
      isConversationGroup: chatBetweenBobAndAlice.isGroup,
      userId: alice.id,
    });

    inMemoryMessagesRepository.items.forEach(message => {
      if (message.conversationId === chatBetweenBobAndAlice.id) {
        expect(message.readAt).toBeTruthy();
      }

      if (message.conversationId === chatBetweenGeorgeAndMichael.id) {
        expect(message.readAt).not.toBeTruthy();
      }
    });
  });

  it('should not be able to read all messages from private conversation if the messages is mine', async () => {
    const inMemoryMessagesRepository = new InMemoryMessagesRepository();
    const inMemoryConversationRepository = new InMemoryConversationRepository();
    const inMemoryMessageStatusRepository = new InMemoryMessageStatusRepository();

    const bob = User.create({ email: 'bob@email.com', name: 'Bob', password: '123' });
    const alice = User.create({ email: 'alice@email.com', name: 'Alice', password: '123' });

    const chatBetweenBobAndAlice = Conversation.create({ isGroup: false });

    inMemoryConversationRepository.items.push(chatBetweenBobAndAlice);

    const message1 = Message.create({ authorId: bob.id, content: 'Hello', conversationId: chatBetweenBobAndAlice.id });
    const message2 = Message.create({ authorId: bob.id, content: 'World', conversationId: chatBetweenBobAndAlice.id });
    const message3 = Message.create({ authorId: bob.id, content: 'Test', conversationId: chatBetweenBobAndAlice.id });

    inMemoryMessagesRepository.items.push(message1);
    inMemoryMessagesRepository.items.push(message2);
    inMemoryMessagesRepository.items.push(message3);

    const readConversationMessagesUseCase = new ReadConversationMessagesUseCase(
      inMemoryMessagesRepository,
      inMemoryConversationRepository,
      inMemoryMessageStatusRepository,
    );

    inMemoryMessagesRepository.items.forEach(message => {
      expect(message.readAt).not.toBeTruthy();
    });

    await readConversationMessagesUseCase.execute({
      conversationId: chatBetweenBobAndAlice.id,
      isConversationGroup: chatBetweenBobAndAlice.isGroup,
      userId: bob.id,
    });

    inMemoryMessagesRepository.items.forEach(message => {
      if (message.conversationId === chatBetweenBobAndAlice.id) {
        expect(message.readAt).not.toBeTruthy();
      }
    });
  });

  it.only('should be able to read all messages from group conversation', async () => {
    const inMemoryMessagesRepository = new InMemoryMessagesRepository();
    const inMemoryConversationRepository = new InMemoryConversationRepository();
    const inMemoryMessageStatusRepository = new InMemoryMessageStatusRepository();

    const bob = User.create({ email: 'bob@email.com', name: 'Bob', password: '123' });
    const alice = User.create({ email: 'alice@email.com', name: 'Alice', password: '123' });
    const george = User.create({ email: 'george@email.com', name: 'Bob', password: '123' });
    const michael = User.create({ email: 'michael@email.com', name: 'Alice', password: '123' });

    const group = Group.create({ name: 'Group Test', description: '', conversation: null });
    const groupConversation = Conversation.create({ isGroup: true, groupId: group.id });
    group.conversation = groupConversation;

    inMemoryConversationRepository.items.push(groupConversation);

    const message1 = Message.create({ authorId: bob.id, content: 'message 1 from Bob', conversationId: groupConversation.id });
    const message2 = Message.create({ authorId: bob.id, content: 'message 2 from Bob', conversationId: groupConversation.id });
    const message3 = Message.create({ authorId: bob.id, content: 'message 3 from Bob', conversationId: groupConversation.id });

    const message4 = Message.create({ authorId: george.id, content: 'message 1 from George', conversationId: groupConversation.id });
    const message5 = Message.create({ authorId: george.id, content: 'message 2 from George', conversationId: groupConversation.id });
    const message6 = Message.create({ authorId: michael.id, content: 'message 1 from Michael', conversationId: groupConversation.id });

    const data = {
      conversation: groupConversation,
      users: [bob, alice, george, michael],
      messages: [message1, message2, message3, message4, message5, message6],
    };

    // Creating message status to all group participants, without author.
    data.messages.forEach(message => {
      inMemoryMessagesRepository.items.push(message);

      data.users.forEach(user => {
        if (user.id !== message.authorId) {
          const ms = MessageStatus.create({ conversationId: data.conversation.id, messageId: message.id, userId: user.id });
          inMemoryMessageStatusRepository.items.push(ms);
        }
      });
    });

    const readConversationMessagesUseCase = new ReadConversationMessagesUseCase(
      inMemoryMessagesRepository,
      inMemoryConversationRepository,
      inMemoryMessageStatusRepository,
    );

    // Alice is reading the remaining messages from the group
    await readConversationMessagesUseCase.execute({
      conversationId: groupConversation.id,
      isConversationGroup: groupConversation.isGroup,
      userId: alice.id,
    });

    inMemoryMessagesRepository.items.forEach(message => {
      expect(message.readAt).not.toBeTruthy();
    });

    inMemoryMessageStatusRepository.items.forEach(messageStatus => {
      if (messageStatus.userId === alice.id) {
        expect(messageStatus.readAt).toBeTruthy();
      } else {
        expect(messageStatus.readAt).not.toBeTruthy();
      }
    });

    inMemoryMessagesRepository.items.forEach(message => {
      expect(message.readAt).not.toBeTruthy();
    });

    await readConversationMessagesUseCase.execute({
      conversationId: groupConversation.id,
      isConversationGroup: groupConversation.isGroup,
      userId: bob.id,
    });

    await readConversationMessagesUseCase.execute({
      conversationId: groupConversation.id,
      isConversationGroup: groupConversation.isGroup,
      userId: george.id,
    });

    await readConversationMessagesUseCase.execute({
      conversationId: groupConversation.id,
      isConversationGroup: groupConversation.isGroup,
      userId: michael.id,
    });

    inMemoryMessageStatusRepository.items.forEach(messageStatus => {
      expect(messageStatus.readAt).toBeTruthy();
    });

    inMemoryMessagesRepository.items.forEach(message => {
      if (!message.readAt) {
        console.log({ message });
      }
      expect(message.readAt).toBeTruthy();
    });
  });
});
