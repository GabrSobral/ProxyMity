import { Message } from '@application/entities/message';
import { SocketStream } from '@fastify/websocket';

import { MapPayload } from 'src/server';

interface Params<T = any> {
  socket: SocketStream;
  payload: T;
  isBinary: boolean;
}

export class WebSocketEvents {
  constructor(private clients: Map<string, MapPayload>) {}

  async connect({ payload, socket }: Params<{ id: string }>) {
    const { id } = payload;

    this.clients.set(id, {
      id,
      socket,
    });

    console.log('👌 new socket connected: ', id);
  }

  async send_message({
    payload,
    socket,
    isBinary,
  }: Params<{ message: Message }>) {
    const { message } = payload;

    if (!message) return;

    const receiverSocket = this.clients.get(message.recipientId);

    if (!receiverSocket) return;

    receiverSocket.socket.socket.send(
      JSON.stringify({
        event: 'receive_message',
        payload: {
          message,
        },
      }),
      { binary: isBinary },
    );

    socket.socket.send(
      JSON.stringify({
        event: 'sent_message',
        payload: {
          message: { ...message, sentAt: new Date() },
        },
      }),
      { binary: isBinary },
    );
  }

  async send_typing({
    socket,
    payload,
    isBinary,
  }: Params<{ typing: boolean; recipientId: string; authorId: string }>) {
    const { typing, recipientId, authorId } = payload;

    const receiverSocket = this.clients.get(recipientId);
    if (!receiverSocket) return;

    receiverSocket.socket.socket.send(
      JSON.stringify({
        event: 'receive_typing',
        payload: {
          typing,
          authorId,
        },
      }),
      { binary: isBinary },
    );
  }
}
