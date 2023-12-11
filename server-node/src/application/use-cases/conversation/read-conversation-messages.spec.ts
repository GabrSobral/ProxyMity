import { describe, expect, it } from 'vitest';

import { SaveMessageUseCase } from '../message/save-message';
import { ReadConversationMessagesUseCase } from './read-conversation-messages';

import { User } from '@application/entities/user';
import { Group } from '@application/entities/group';
import { Message } from '@application/entities/message';
import { Participant } from '@application/entities/participant';
import { Conversation } from '@application/entities/conversation';

import { InMemoryMessagesRepository } from 'src/tests/repositories/inMemoryMessagesRepository';
import { InMemoryParticipantRepository } from 'src/tests/repositories/inMemoryParticipantRepository';
import { InMemoryConversationRepository } from 'src/tests/repositories/inMemoryConversationRepository';
import { InMemoryMessageStatusRepository } from 'src/tests/repositories/inMemoryMessageStatusRepository';

describe('ReadConversationMessagesUseCase', () => {
  it('should be able to read all messages from private conversation', async () => {
    const inMemoryMessagesRepository = new InMemoryMessagesRepository();
    const inMemoryConversationRepository = new InMemoryConversationRepository();
    const inMemoryMessageStatusRepository = new InMemoryMessageStatusRepository();

    const bob = User.create({ email: 'bob@email.com', name: 'Bob', password: '123' });
    const alice = User.create({ email: 'alice@email.com', name: 'Alice', password: '123' });
    const george = User.create({ email: 'george@email.com', name: 'Bob', password: '123' });
    const gabriel = User.create({ email: 'gabriel@email.com', name: 'Alice', password: '123' });

    const chatBetweenBobAndAlice = Conversation.create({ isGroup: false });
    const chatBetweenGeorgeAndGabriel = Conversation.create({ isGroup: false });

    inMemoryConversationRepository.items.push(chatBetweenBobAndAlice);
    inMemoryConversationRepository.items.push(chatBetweenGeorgeAndGabriel);

    const message1 = Message.create({ authorId: bob.id, content: 'Hello', conversationId: chatBetweenBobAndAlice.id });
    const message2 = Message.create({ authorId: bob.id, content: 'World', conversationId: chatBetweenBobAndAlice.id });
    const message3 = Message.create({ authorId: bob.id, content: 'Test', conversationId: chatBetweenBobAndAlice.id });
    const message4 = Message.create({ authorId: george.id, content: 'Hello', conversationId: chatBetweenGeorgeAndGabriel.id });
    const message5 = Message.create({ authorId: george.id, content: 'World', conversationId: chatBetweenGeorgeAndGabriel.id });
    const message6 = Message.create({ authorId: george.id, content: 'Test', conversationId: chatBetweenGeorgeAndGabriel.id });

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

      if (message.conversationId === chatBetweenGeorgeAndGabriel.id) {
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

  it('should be able to read all messages from group conversation', async () => {
    const inMemoryMessagesRepository = new InMemoryMessagesRepository();
    const inMemoryConversationRepository = new InMemoryConversationRepository();
    const inMemoryMessageStatusRepository = new InMemoryMessageStatusRepository();
    const inMemoryParticipantRepository = new InMemoryParticipantRepository();

    const bob = User.create({ email: 'bob@email.com', name: 'Bob', password: '123' });
    const alice = User.create({ email: 'alice@email.com', name: 'Alice', password: '123' });
    const george = User.create({ email: 'george@email.com', name: 'George', password: '123' });
    const gabriel = User.create({ email: 'gabriel@email.com', name: 'Gabriel', password: '123' });

    const group = Group.create({ name: 'Group Test', description: '', conversation: null });
    const groupConversation = Conversation.create({ isGroup: true, groupId: group.id });
    group.conversation = groupConversation;

    inMemoryConversationRepository.items.push(groupConversation);

    inMemoryParticipantRepository.add(Participant.create({ userId: bob.id, conversationId: groupConversation.id }));
    inMemoryParticipantRepository.add(Participant.create({ userId: alice.id, conversationId: groupConversation.id }));
    inMemoryParticipantRepository.add(Participant.create({ userId: george.id, conversationId: groupConversation.id }));
    inMemoryParticipantRepository.add(Participant.create({ userId: gabriel.id, conversationId: groupConversation.id }));

    expect(inMemoryParticipantRepository.items).toHaveLength(4);

    const saveMessage = new SaveMessageUseCase(
      inMemoryMessagesRepository,
      inMemoryParticipantRepository,
      inMemoryConversationRepository,
      inMemoryMessageStatusRepository,
    );

    await Promise.all([
      saveMessage.execute({ message: Message.create({ authorId: bob.id, content: 'msg 1 from Bob', conversationId: groupConversation.id }) }),
      saveMessage.execute({ message: Message.create({ authorId: gabriel.id, content: 'msg 1 from Gabriel', conversationId: groupConversation.id }) }),
      // saveMessage.execute({ message: Message.create({ authorId: bob.id, content: 'msg 2 from Bob', conversationId: groupConversation.id }) }),
      // saveMessage.execute({ message: Message.create({ authorId: bob.id, content: 'msg 3 from Bob', conversationId: groupConversation.id }) }),
      // saveMessage.execute({ message: Message.create({ authorId: george.id, content: 'msg 1 from George', conversationId: groupConversation.id }) }),
      // saveMessage.execute({ message: Message.create({ authorId: george.id, content: 'msg 2 from George', conversationId: groupConversation.id }) }),
      // saveMessage.execute({ message: Message.create({ authorId: alice.id, content: 'msg 1 from Alice', conversationId: groupConversation.id }) }),
    ]);

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

    const aliceMs = inMemoryMessagesRepository.items.filter(x => !x.readAt);

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

    // Bob is reading the remaining messages from the group
    await readConversationMessagesUseCase.execute({
      conversationId: groupConversation.id,
      isConversationGroup: groupConversation.isGroup,
      userId: bob.id,
    });

    const bobMs = inMemoryMessagesRepository.items.filter(x => !x.readAt);

    inMemoryMessageStatusRepository.items.forEach(messageStatus => {
      if (messageStatus.userId === bob.id) {
        expect(messageStatus.readAt).toBeTruthy();
      } else if (![alice.id].includes(messageStatus.userId)) {
        expect(messageStatus.readAt).not.toBeTruthy();
      }
    });

    // George is reading the remaining messages from the group
    await readConversationMessagesUseCase.execute({
      conversationId: groupConversation.id,
      isConversationGroup: groupConversation.isGroup,
      userId: george.id,
    });

    const georgeMs = inMemoryMessagesRepository.items.filter(x => !x.readAt);

    inMemoryMessageStatusRepository.items.forEach(messageStatus => {
      if (messageStatus.userId === george.id) {
        expect(messageStatus.readAt).toBeTruthy();
      } else if (![alice.id, bob.id].includes(messageStatus.userId)) {
        expect(messageStatus.readAt).not.toBeTruthy();
      }
    });

    // Gabriel is reading the remaining messages from the group
    await readConversationMessagesUseCase.execute({
      conversationId: groupConversation.id,
      isConversationGroup: groupConversation.isGroup,
      userId: gabriel.id,
    });

    const gabrielMs = inMemoryMessagesRepository.items.filter(x => !x.readAt);

    inMemoryMessageStatusRepository.items.forEach(messageStatus => {
      if (messageStatus.userId === gabriel.id) {
        expect(messageStatus.readAt).toBeTruthy();
      } else if (![alice.id, bob.id, george.id].includes(messageStatus.userId)) {
        expect(messageStatus.readAt).not.toBeTruthy();
      }
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
