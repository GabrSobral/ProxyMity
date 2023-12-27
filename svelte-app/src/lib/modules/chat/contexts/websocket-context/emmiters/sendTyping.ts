// import { toBinary } from '@/utils/binary-parser';
import { HubConnection } from '@microsoft/signalr';

interface ISendTypingWebSocketPayload {
	typing: boolean;
	conversationId: string;
	authorId: string;
}

export function sendTypingWebSocketEvent(connection: HubConnection, payload: ISendTypingWebSocketPayload) {
	// socket.send(toBinary(JSON.stringify({ event: 'send_typing', payload })));
	connection.invoke('onSendTyping', payload);
}
