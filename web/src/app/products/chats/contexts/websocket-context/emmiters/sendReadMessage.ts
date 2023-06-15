import { toBinary } from '@/utils/binary-parser';

interface ISendReadMessageWebSocketPayload {
	contactId: string;
	recipientId: string;
}

export function sendReadMessageWebSocketEvent(socket: WebSocket, payload: ISendReadMessageWebSocketPayload) {
	socket.send(toBinary(JSON.stringify({ event: 'send_read_message', payload })));
}
