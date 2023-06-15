import { SocketStream } from '@fastify/websocket';

import { Contact } from '@application/entities/contact';

interface Payload {
  contactId: Contact['id'];
}

export function receiveReadMessageWS(socket: SocketStream['socket'], payload: Payload) {
  const data = JSON.stringify({ event: 'receive_read_message', payload });

  socket.send(data, { binary: true });
}
