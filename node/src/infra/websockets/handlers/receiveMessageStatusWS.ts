import { SocketStream } from '@fastify/websocket';

import { Message } from '@application/entities/message';
import { Contact } from '@application/entities/contact';

interface Payload {
  messageId: Message['id'];
  contactId: Contact['id'];
  status: 'sent' | 'received';
}

export function receiveMessageStatusWS(socket: SocketStream['socket'], payload: Payload) {
  const data = JSON.stringify({ event: 'receive_message_status', payload });

  socket.send(data, { binary: true });
}
