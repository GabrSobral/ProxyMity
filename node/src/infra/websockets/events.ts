import { Message } from '@application/entities/message';
import { SocketStream } from '@fastify/websocket';

import { MapPayload } from 'src/server';

interface Params<T = any> {
  socket: SocketStream;
  payload: T;
}

export class WebSocketEvents {
  constructor(private clients: Map<string, MapPayload>) {}

  async connect({ payload, socket }: Params<{ email: string }>) {
    const { email } = payload;

    this.clients.set(email, {
      email,
      socket,
    });

    console.log('👌 new socket connected: ', email);
  }

  async send_message({
    payload,
    socket,
  }: Params<{ sender: string; receiver: string; message: Message }>) {
    const { sender, receiver, message } = payload;

    if (!message || !sender || !receiver) return;

    const receiverSocket = this.clients.get(receiver);

    if (!receiverSocket) return;

    receiverSocket.socket.socket.send(
      JSON.stringify({
        event: 'receive_message',
        payload: {
          sender,
          message,
        },
      }),
    );

    socket.socket.send(
      JSON.stringify({
        event: 'received_message',
        payload: {
          message,
        },
      }),
    );
  }
}
