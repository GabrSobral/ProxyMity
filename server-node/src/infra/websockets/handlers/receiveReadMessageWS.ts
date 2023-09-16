import { WebSocket } from 'ws';

import { Conversation } from '@application/entities/conversation';
import { User } from '@application/entities/user';

interface Payload {
  conversationId: Conversation['id'];
  userId: User['_id'];
}

export function receiveReadMessageWS(socket: WebSocket, payload: Payload) {
  const data = JSON.stringify({ event: 'receive_read_message', payload });

  socket.send(data, { binary: true });
}
