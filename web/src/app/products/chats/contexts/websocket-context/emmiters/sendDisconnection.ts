import { toBinary } from '@/utils/binary-parser';

interface ISendConnectionWebSocketPayload {
	id: string;
}

export function sendDisconnectionWebSocketEvent(socket: WebSocket, payload: ISendConnectionWebSocketPayload) {
	socket.send(toBinary(JSON.stringify({ event: 'disconnect', payload })));
}
