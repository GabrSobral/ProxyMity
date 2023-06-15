import { SocketStream } from '@fastify/websocket';

import { Message } from '@application/entities/message';

interface Payload {
  message: Message;
}

export function receiveMessageWS(socket: SocketStream['socket'], payload: Payload) {
  const data = JSON.stringify({ event: 'receive_message', payload });

  socket.send(data, { binary: true });
}
