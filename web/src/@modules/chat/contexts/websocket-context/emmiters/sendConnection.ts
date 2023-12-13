import { toBinary } from '@/utils/binary-parser';

interface ISendConnectionWebSocketPayload {
	id: string;
}

export function sendConnectionWebSocketEvent(socket: WebSocket, payload: ISendConnectionWebSocketPayload) {
	socket.send(toBinary(JSON.stringify({ event: 'connect', payload })));
}
