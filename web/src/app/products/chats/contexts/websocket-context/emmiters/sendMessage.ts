import { Message } from '@/types/message';
import { toBinary } from '@/utils/binary-parser';

interface ISendMessageWebSocketPayload {
	message: Message;
	sender: string;
	receiver: string;
}

export function sendMessageWebSocketEvent(socket: WebSocket, payload: ISendMessageWebSocketPayload) {
	socket.send(toBinary(JSON.stringify({ event: 'send_message', payload })));
}
