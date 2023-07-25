import { WebSocket } from 'ws';

import { Message } from '@application/entities/message';

interface Payload {
  typing: boolean;
  authorId: Message['authorId'];
}

export function receiveTypingWS(socket: WebSocket, payload: Payload) {
  const data = JSON.stringify({ event: 'receive_typing', payload });

  socket.send(data, { binary: true });
}
