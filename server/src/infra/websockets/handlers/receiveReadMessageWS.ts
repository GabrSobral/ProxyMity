import { WebSocket } from 'ws';

import { Conversation } from '@application/entities/conversation';

interface Payload {
  conversationId: Conversation['id'];
}

export function receiveReadMessageWS(socket: WebSocket, payload: Payload) {
  const data = JSON.stringify({ event: 'receive_read_message', payload });

  socket.send(data, { binary: true });
}
