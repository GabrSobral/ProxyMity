import { PrismaClient } from '@prisma/client';
import { SocketStream } from '@fastify/websocket';

import { Message } from '@application/entities/message';

import { MessageRepository } from '@application/repositories/message-repository';

import { MessageUseCase } from '@application/use-cases/message/message-use-case';

import { MapPayload } from 'src/server';

import { receiveTypingWS } from './handlers/receiveTypingWS';
import { receiveMessageWS } from './handlers/receiveMessageWS';
import { receiveReadMessageWS } from './handlers/receiveReadMessageWS';
import { receiveMessageStatusWS } from './handlers/receiveMessageStatusWS';

import { PrismaMessageRepository } from '@infra/database/prisma/repositories/prisma-message-repository';

interface WSParams<T = any> {
  socket: SocketStream;
  payload: T;
}

export class WebSocketEvents {
  private readonly _prismaClient: PrismaClient;
  private readonly _prismaMessageRepository: MessageRepository;

  private readonly _messageUseCase: MessageUseCase;

  constructor(private clients: Map<string, MapPayload>) {
    this._prismaClient = new PrismaClient();
    this._prismaMessageRepository = new PrismaMessageRepository(this._prismaClient);

    this._messageUseCase = new MessageUseCase(this._prismaMessageRepository);
  }

  private findSocket(socketId: string) {
    return this.clients.get(socketId)?.socket.socket;
  }

  async connect({ payload, socket }: WSParams<{ id: string }>) {
    const { id } = payload;

    this.clients.set(id, { id, socket });
    console.log('👌 new socket connected: ', id);
  }

  async send_message({ payload, socket }: WSParams<{ message: Message }>) {
    const { message } = payload;
    const receiverSocket = this.findSocket(message.recipientId);
    const mySocket = socket.socket;

    if (!message || !receiverSocket) return;

    const messageInstance = Message.create(message);

    await this._messageUseCase.saveMessage(messageInstance);

    receiveMessageWS(receiverSocket, { message });
    receiveTypingWS(receiverSocket, { typing: false, authorId: message.authorId });
    receiveMessageStatusWS(mySocket, { status: 'sent', messageId: message.id, contactId: message.recipientId });

    await this._messageUseCase.updateMessageStatus({ message: messageInstance, status: 'sent' });
  }

  async send_typing({ payload }: WSParams<{ typing: boolean; recipientId: string; authorId: string }>) {
    const { typing, recipientId, authorId } = payload;
    const receiverSocket = this.findSocket(recipientId);

    if (!receiverSocket) return;

    receiveTypingWS(receiverSocket, { typing, authorId });
  }

  async send_read_message({ payload }: WSParams<{ contactId: string; recipientId: string }>) {
    const { contactId, recipientId } = payload;
    const receiverSocket = this.findSocket(recipientId);

    if (!receiverSocket) return;

    receiveReadMessageWS(receiverSocket, { contactId });
  }

  async send_receive_message({ payload }: WSParams<{ contactId: string; recipientId: string; messageId: string }>) {
    const { contactId, recipientId, messageId } = payload;
    const receiverSocket = this.findSocket(recipientId);

    if (!receiverSocket) return;

    receiveMessageStatusWS(receiverSocket, { status: 'received', contactId, messageId });
  }
}
