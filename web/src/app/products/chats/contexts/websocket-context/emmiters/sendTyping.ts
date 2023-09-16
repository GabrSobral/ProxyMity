import { toBinary } from '@/utils/binary-parser';

interface ISendTypingWebSocketPayload {
	typing: boolean;
	conversationId: string;
	authorId: string;
}

export function sendTypingWebSocketEvent(socket: WebSocket, payload: ISendTypingWebSocketPayload) {
	socket.send(toBinary(JSON.stringify({ event: 'send_typing', payload })));
}
