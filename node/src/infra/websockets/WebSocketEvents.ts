import { Message } from '@application/entities/message';
import { SocketStream } from '@fastify/websocket';

import { MapPayload } from 'src/server';

import { receiveMessageWS } from './handlers/receiveMessageWS';
import { receiveMessageStatusWS } from './handlers/receiveMessageStatusWS';
import { receiveTypingWS } from './handlers/receiveTypingWS';
import { receiveReadMessageWS } from './handlers/receiveReadMessageWS';

interface WSParams<T = any> {
  socket: SocketStream;
  payload: T;
}

export class WebSocketEvents {
  constructor(private clients: Map<string, MapPayload>) {}

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

    if (!message || !receiverSocket) return;

    const mySocket = socket.socket;

    receiveMessageWS(receiverSocket, { message });
    receiveTypingWS(receiverSocket, { typing: false, authorId: message.authorId });
    receiveMessageStatusWS(mySocket, { status: 'sent', messageId: message.id, contactId: message.recipientId });
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
