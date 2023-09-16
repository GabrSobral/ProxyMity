import { WebSocket } from 'ws';

import { Message } from '@application/entities/message';

interface Payload {
  message: Message;
}

export function receiveMessageWS(socket: WebSocket, payload: Payload) {
  const data = JSON.stringify({ event: 'receive_message', payload });

  socket.send(data, { binary: true });
}
