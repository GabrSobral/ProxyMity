// import { toBinary } from '@/utils/binary-parser';
import { HubConnection } from '@microsoft/signalr';

interface ISendReadMessageWebSocketPayload {
	userId: string;
	conversationId: string;
	isConversationGroup: boolean;
}

export function sendReadMessageWebSocketEvent(connection: HubConnection, payload: ISendReadMessageWebSocketPayload) {
	// socket.send(toBinary(JSON.stringify({ event: 'send_read_message', payload })));
	connection.invoke('onSendReadMessage', payload);
}
