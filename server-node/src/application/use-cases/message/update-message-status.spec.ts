import { describe, expect, it } from 'vitest';

import { User } from '@application/entities/user';
import { Message } from '@application/entities/message';
import { Conversation } from '@application/entities/conversation';
import { MessageStatus } from '@application/entities/message-status';

import { UpdateMessageStatusUseCase } from './update-message-status';

import { InMemoryMessagesRepository } from 'src/tests/repositories/inMemoryMessagesRepository';
import { InMemoryMessageStatusRepository } from 'src/tests/repositories/inMemoryMessageStatusRepository';

describe('UpdateMessageStatusUseCase', () => {
  it("should be able to update the message status to 'sent' on private conversation", async () => {
    const inMemoryMessagesRepository = new InMemoryMessagesRepository();
    const inMemoryMessageStatusRepository = new InMemoryMessageStatusRepository();

    const updateMessageStatusUseCase = new UpdateMessageStatusUseCase(
      inMemoryMessagesRepository,
      inMemoryMessageStatusRepository,
    );

    const user1 = User.create({ email: 'email1@gmail.com', name: 'Test1', password: '123' });

    const conversation = Conversation.create({ isGroup: false });

    const message1 = Message.create({
      authorId: user1.id,
      content: 'Hello',
      conversationId: conversation.id,
    });

    const message2 = Message.create({
      authorId: user1.id,
      content: 'World',
      conversationId: conversation.id,
    });

    await inMemoryMessagesRepository.create(message1);
    await inMemoryMessagesRepository.create(message2);

    const result = await updateMessageStatusUseCase.execute({
      isConversationGroup: conversation.isGroup,
      conversationId: conversation.id,
      messageId: message1.id,
      status: 'sent',
      userId: user1.id,
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryMessageStatusRepository.items).toHaveLength(0);
  });

  it("should be able to update the message status to 'received' on private conversation", async () => {
    const inMemoryMessagesRepository = new InMemoryMessagesRepository();
    const inMemoryMessageStatusRepository = new InMemoryMessageStatusRepository();

    const updateMessageStatusUseCase = new UpdateMessageStatusUseCase(
      inMemoryMessagesRepository,
      inMemoryMessageStatusRepository,
    );

    const user1 = User.create({ email: 'email1@gmail.com', name: 'Test1', password: '123' });

    const conversation = Conversation.create({ isGroup: false });

    const message1 = Message.create({
      authorId: user1.id,
      content: 'Hello',
      conversationId: conversation.id,
    });

    const message2 = Message.create({
      authorId: user1.id,
      content: 'World',
      conversationId: conversation.id,
    });

    await inMemoryMessagesRepository.create(message1);
    await inMemoryMessagesRepository.create(message2);

    await updateMessageStatusUseCase.execute({
      isConversationGroup: conversation.isGroup,
      messageId: message1.id,
      conversationId: conversation.id,
      status: 'sent',
      userId: user1.id,
    });

    const result = await updateMessageStatusUseCase.execute({
      isConversationGroup: conversation.isGroup,
      messageId: message1.id,
      conversationId: conversation.id,
      status: 'received',
      userId: user1.id,
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryMessageStatusRepository.items).toHaveLength(0);
  });

  it("should be able to update the message status to 'read' on private conversation", async () => {
    const inMemoryMessagesRepository = new InMemoryMessagesRepository();
    const inMemoryMessageStatusRepository = new InMemoryMessageStatusRepository();

    const updateMessageStatusUseCase = new UpdateMessageStatusUseCase(
      inMemoryMessagesRepository,
      inMemoryMessageStatusRepository,
    );

    const user1 = User.create({ email: 'email1@gmail.com', name: 'Test1', password: '123' });

    const conversation = Conversation.create({ isGroup: false });

    const message1 = Message.create({
      authorId: user1.id,
      content: 'Hello',
      conversationId: conversation.id,
    });

    const message2 = Message.create({
      authorId: user1.id,
      content: 'World',
      conversationId: conversation.id,
    });

    await inMemoryMessagesRepository.create(message1);
    await inMemoryMessagesRepository.create(message2);

    await updateMessageStatusUseCase.execute({
      isConversationGroup: conversation.isGroup,
      messageId: message1.id,
      conversationId: conversation.id,
      status: 'sent',
      userId: user1.id,
    });

    await updateMessageStatusUseCase.execute({
      isConversationGroup: conversation.isGroup,
      messageId: message1.id,
      conversationId: conversation.id,
      status: 'received',
      userId: user1.id,
    });

    const result = await updateMessageStatusUseCase.execute({
      isConversationGroup: conversation.isGroup,
      messageId: message1.id,
      conversationId: conversation.id,
      status: 'read',
      userId: user1.id,
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryMessageStatusRepository.items).toHaveLength(0);
  });

  it("should be able to update the message status to 'sent' on group conversation", async () => {
    const inMemoryMessagesRepository = new InMemoryMessagesRepository();
    const inMemoryMessageStatusRepository = new InMemoryMessageStatusRepository();

    const updateMessageStatusUseCase = new UpdateMessageStatusUseCase(
      inMemoryMessagesRepository,
      inMemoryMessageStatusRepository,
    );

    const user1 = User.create({ email: 'email1@gmail.com', name: 'Test1', password: '123' });
    const user2 = User.create({ email: 'email2@gmail.com', name: 'Test2', password: '123' });

    const conversation = Conversation.create({ isGroup: true, groupId: 'group-id' });

    const message1 = Message.create({
      authorId: user1.id,
      content: 'Hello',
      conversationId: conversation.id,
    });

    const message2 = Message.create({
      authorId: user1.id,
      content: 'World',
      conversationId: conversation.id,
    });

    await inMemoryMessagesRepository.create(message1);
    await inMemoryMessagesRepository.create(message2);

    const messageStatus1 = MessageStatus.create({
      messageId: message1.id,
      userId: user2.id,
      conversationId: conversation.id,
    });
    const messageStatus2 = MessageStatus.create({
      messageId: message2.id,
      userId: user2.id,
      conversationId: conversation.id,
    });

    await inMemoryMessageStatusRepository.create(messageStatus1);
    await inMemoryMessageStatusRepository.create(messageStatus2);

    const result1 = await updateMessageStatusUseCase.execute({
      isConversationGroup: conversation.isGroup,
      messageId: message1.id,
      conversationId: conversation.id,
      status: 'sent',
      userId: user2.id,
    });

    const result2 = await updateMessageStatusUseCase.execute({
      isConversationGroup: conversation.isGroup,
      messageId: message2.id,
      conversationId: conversation.id,
      status: 'sent',
      userId: user2.id,
    });

    expect(result1.isRight()).toBeTruthy();
    expect(result2.isRight()).toBeTruthy();

    if (result1.isRight()) {
      expect(inMemoryMessageStatusRepository.items).toHaveLength(2);

      inMemoryMessagesRepository.items.forEach(item => {
        expect(item.sentAt).toBeTruthy();
      });

      inMemoryMessageStatusRepository.items.forEach(item => {
        expect(item.readAt).not.toBeTruthy();
        expect(item.receivedAt).not.toBeTruthy();
      });
    } else {
      throw new Error(result1.value.message);
    }
  });

  it("should be able to update the message status to 'received' on group conversation", async () => {
    const inMemoryMessagesRepository = new InMemoryMessagesRepository();
    const inMemoryMessageStatusRepository = new InMemoryMessageStatusRepository();

    const user1 = User.create({ email: 'email1@gmail.com', name: 'Test1', password: '123' });
    const user2 = User.create({ email: 'email2@gmail.com', name: 'Test2', password: '123' });
    const user3 = User.create({ email: 'email3@gmail.com', name: 'Test3', password: '123' });

    const conversation = Conversation.create({ isGroup: true, groupId: 'group-id' });

    const message1 = Message.create({
      authorId: user1.id,
      content: 'Hello',
      conversationId: conversation.id,
    });

    const message2 = Message.create({
      authorId: user1.id,
      content: 'World',
      conversationId: conversation.id,
    });

    await inMemoryMessagesRepository.create(message1);
    await inMemoryMessagesRepository.create(message2);

    const message1StatusUser2 = MessageStatus.create({
      messageId: message1.id,
      userId: user2.id,
      conversationId: conversation.id,
    });
    const message2StatusUser2 = MessageStatus.create({
      messageId: message2.id,
      userId: user2.id,
      conversationId: conversation.id,
    });

    const message1StatusUser3 = MessageStatus.create({
      messageId: message1.id,
      userId: user2.id,
      conversationId: conversation.id,
    });
    const message2StatusUser3 = MessageStatus.create({
      messageId: message2.id,
      userId: user2.id,
      conversationId: conversation.id,
    });

    await inMemoryMessageStatusRepository.create(message1StatusUser2);
    await inMemoryMessageStatusRepository.create(message2StatusUser2);

    await inMemoryMessageStatusRepository.create(message1StatusUser3);
    await inMemoryMessageStatusRepository.create(message2StatusUser3);

    const updateMessageStatusUseCase = new UpdateMessageStatusUseCase(
      inMemoryMessagesRepository,
      inMemoryMessageStatusRepository,
    );

    const result1 = await updateMessageStatusUseCase.execute({
      isConversationGroup: conversation.isGroup,
      messageId: message1.id,
      conversationId: conversation.id,
      status: 'sent',
      userId: user2.id,
    });

    const result2 = await updateMessageStatusUseCase.execute({
      isConversationGroup: conversation.isGroup,
      messageId: message2.id,
      conversationId: conversation.id,
      status: 'sent',
      userId: user2.id,
    });

    const result3 = await updateMessageStatusUseCase.execute({
      isConversationGroup: conversation.isGroup,
      messageId: message1.id,
      conversationId: conversation.id,
      status: 'sent',
      userId: user3.id,
    });

    const result4 = await updateMessageStatusUseCase.execute({
      isConversationGroup: conversation.isGroup,
      messageId: message2.id,
      conversationId: conversation.id,
      status: 'sent',
      userId: user3.id,
    });

    expect(result1.isRight()).toBeTruthy();
    expect(result2.isRight()).toBeTruthy();
    expect(result3.isRight()).toBeTruthy();
    expect(result4.isRight()).toBeTruthy();

    if (result1.isRight()) {
      expect(inMemoryMessageStatusRepository.items).toHaveLength(4);

      inMemoryMessagesRepository.items.forEach(item => {
        expect(item.sentAt).toBeTruthy();
      });

      inMemoryMessageStatusRepository.items.forEach(item => {
        expect(item.readAt).not.toBeTruthy();
        expect(item.receivedAt).not.toBeTruthy();
      });
    } else {
      throw new Error(result1.value.message);
    }

    // Handling receive message 1

    const result5 = await updateMessageStatusUseCase.execute({
      isConversationGroup: conversation.isGroup,
      messageId: message1.id,
      conversationId: conversation.id,
      status: 'received',
      userId: user2.id,
    });

    const result6 = await updateMessageStatusUseCase.execute({
      isConversationGroup: conversation.isGroup,
      messageId: message1.id,
      conversationId: conversation.id,
      status: 'received',
      userId: user3.id,
    });

    expect(result5.isRight()).toBeTruthy();
    expect(result6.isRight()).toBeTruthy();

    if (result5.isRight()) {
      expect(inMemoryMessageStatusRepository.items).toHaveLength(4);

      inMemoryMessagesRepository.items.forEach(item => {
        if (item.id === message1.id) {
          expect(item.sentAt).toBeTruthy();
          expect(item.receivedAt).toBeTruthy();
        } else {
          expect(item.receivedAt).not.toBeTruthy();
        }
      });

      [user2.id, user3.id].forEach(userId => {
        inMemoryMessageStatusRepository.items.forEach(item => {
          if (item.messageId === message1.id && item.userId === userId) {
            expect(item.readAt).not.toBeTruthy();
            expect(item.receivedAt).toBeTruthy();
          }
        });
      });
    } else {
      throw new Error(result5.value.message);
    }
  });

  it("should be able to update the message status to 'read' on group conversation", async () => {
    const inMemoryMessagesRepository = new InMemoryMessagesRepository();
    const inMemoryMessageStatusRepository = new InMemoryMessageStatusRepository();

    const updateMessageStatusUseCase = new UpdateMessageStatusUseCase(
      inMemoryMessagesRepository,
      inMemoryMessageStatusRepository,
    );

    const user1 = User.create({ email: 'email1@gmail.com', name: 'Test1', password: '123' });
    const user2 = User.create({ email: 'email2@gmail.com', name: 'Test2', password: '123' });

    const conversation = Conversation.create({ isGroup: true, groupId: 'group-id' });

    const message1 = Message.create({
      authorId: user1.id,
      content: 'Hello',
      conversationId: conversation.id,
    });

    const message2 = Message.create({
      authorId: user1.id,
      content: 'World',
      conversationId: conversation.id,
    });

    await inMemoryMessagesRepository.create(message1);
    await inMemoryMessagesRepository.create(message2);

    const messageStatus1 = MessageStatus.create({
      messageId: message1.id,
      userId: user2.id,
      conversationId: conversation.id,
    });
    const messageStatus2 = MessageStatus.create({
      messageId: message2.id,
      userId: user2.id,
      conversationId: conversation.id,
    });

    await inMemoryMessageStatusRepository.create(messageStatus1);
    await inMemoryMessageStatusRepository.create(messageStatus2);

    const result1 = await updateMessageStatusUseCase.execute({
      isConversationGroup: conversation.isGroup,
      messageId: message1.id,
      conversationId: conversation.id,
      status: 'sent',
      userId: user2.id,
    });

    const result2 = await updateMessageStatusUseCase.execute({
      isConversationGroup: conversation.isGroup,
      messageId: message2.id,
      conversationId: conversation.id,
      status: 'sent',
      userId: user2.id,
    });

    expect(result1.isRight()).toBeTruthy();
    expect(result2.isRight()).toBeTruthy();

    if (result1.isRight()) {
      expect(inMemoryMessageStatusRepository.items).toHaveLength(2);

      inMemoryMessagesRepository.items.forEach(item => {
        expect(item.sentAt).toBeTruthy();
      });

      inMemoryMessageStatusRepository.items.forEach(item => {
        expect(item.readAt).not.toBeTruthy();
        expect(item.receivedAt).not.toBeTruthy();
      });
    } else {
      throw new Error(result1.value.message);
    }

    // Handling receiving message 1

    const result3 = await updateMessageStatusUseCase.execute({
      isConversationGroup: conversation.isGroup,
      messageId: message1.id,
      conversationId: conversation.id,
      status: 'received',
      userId: user2.id,
    });

    expect(result3.isRight()).toBeTruthy();

    if (result3.isRight()) {
      expect(inMemoryMessageStatusRepository.items).toHaveLength(2);

      inMemoryMessagesRepository.items.forEach(item => {
        if (item.id === message1.id) {
          expect(item.sentAt).toBeTruthy();
          expect(item.receivedAt).toBeTruthy();
        } else {
          expect(item.receivedAt).not.toBeTruthy();
        }
      });

      inMemoryMessageStatusRepository.items.forEach(item => {
        if (item.messageId === message1.id && item.userId === user2.id) {
          expect(item.readAt).not.toBeTruthy();
          expect(item.receivedAt).toBeTruthy();
        }
      });
    } else {
      throw new Error(result3.value.message);
    }

    // Handling reading message 1 and 2

    const result4 = await updateMessageStatusUseCase.execute({
      isConversationGroup: conversation.isGroup,
      messageId: message1.id,
      conversationId: conversation.id,
      status: 'read',
      userId: user2.id,
    });

    await updateMessageStatusUseCase.execute({
      isConversationGroup: conversation.isGroup,
      messageId: message2.id,
      conversationId: conversation.id,
      status: 'received',
      userId: user2.id,
    });

    const result5 = await updateMessageStatusUseCase.execute({
      isConversationGroup: conversation.isGroup,
      messageId: message2.id,
      conversationId: conversation.id,
      status: 'read',
      userId: user2.id,
    });

    expect(result4.isRight()).toBeTruthy();
    expect(result5.isRight()).toBeTruthy();

    if (result4.isRight() && result5.isRight()) {
      expect(inMemoryMessageStatusRepository.items).toHaveLength(2);

      inMemoryMessagesRepository.items.forEach(item => {
        expect(item.sentAt).toBeTruthy();
        expect(item.receivedAt).toBeTruthy();
        expect(item.receivedAt).toBeTruthy();
      });

      inMemoryMessageStatusRepository.items.forEach(item => {
        expect(item.receivedAt).toBeTruthy();
        expect(item.readAt).toBeTruthy();
      });
    } else {
      throw new Error('Error');
    }
  });
});
