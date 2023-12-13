import { toBinary } from '@/utils/binary-parser';

interface ISendReadMessageWebSocketPayload {
	userId: string;
	conversationId: string;
	isConversationGroup: boolean;
}

export function sendReadMessageWebSocketEvent(socket: WebSocket, payload: ISendReadMessageWebSocketPayload) {
	socket.send(toBinary(JSON.stringify({ event: 'send_read_message', payload })));
}
