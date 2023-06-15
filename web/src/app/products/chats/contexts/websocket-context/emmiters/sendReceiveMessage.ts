import { toBinary } from '@/utils/binary-parser';

interface ISendTypingWebSocketPayload {
	messageId: string;
	recipientId: string;
	contactId: string;
}

export function sendReceiveMessageWebSocketEvent(socket: WebSocket, payload: ISendTypingWebSocketPayload) {
	socket.send(toBinary(JSON.stringify({ event: 'send_receive_message', payload })));
}
