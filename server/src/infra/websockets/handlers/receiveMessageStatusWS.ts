import { WebSocket } from 'ws';

import { Message } from '@application/entities/message';
import { Conversation } from '@application/entities/conversation';

interface Payload {
  messageId: Message['id'];
  conversationId: Conversation['id'];
  status: 'sent' | 'received';
}

export function receiveMessageStatusWS(socket: WebSocket, payload: Payload) {
  const data = JSON.stringify({ event: 'receive_message_status', payload });

  socket.send(data, { binary: true });
}
