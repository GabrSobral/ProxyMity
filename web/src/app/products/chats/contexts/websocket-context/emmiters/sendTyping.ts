import { toBinary } from '@/utils/binary-parser';

interface ISendTypingWebSocketPayload {
	typing: boolean;
	recipientId: string;
	authorId: string;
}

export function sendTypingWebSocketEvent(socket: WebSocket, payload: ISendTypingWebSocketPayload) {
	socket.send(toBinary(JSON.stringify({ event: 'send_typing', payload })));
}
