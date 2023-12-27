// import { toBinary } from '@/utils/binary-parser';
import { HubConnection } from '@microsoft/signalr';
import type { Message } from '../../../../../../types/message';

interface ISendMessageWebSocketPayload {
	message: Message;
	sender: string;
	receiver: string;
}

export function sendMessageWebSocketEvent(connection: HubConnection, payload: ISendMessageWebSocketPayload) {
	connection.invoke('onSendMessage', payload);
	// socket.send(toBinary(JSON.stringify({ event: 'send_message', payload })));
}
