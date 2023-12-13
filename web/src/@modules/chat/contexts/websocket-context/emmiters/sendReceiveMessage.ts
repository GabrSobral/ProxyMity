import { toBinary } from '@/utils/binary-parser';

interface ISendTypingWebSocketPayload {
	messageId: string;
	conversationId: string;
	userId: string;
	isConversationGroup: boolean;
}

export function sendReceiveMessageWebSocketEvent(socket: WebSocket, payload: ISendTypingWebSocketPayload) {
	socket.send(toBinary(JSON.stringify({ event: 'send_receive_message', payload })));
}
