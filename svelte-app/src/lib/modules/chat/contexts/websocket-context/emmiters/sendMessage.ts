import { Message } from '@/types/message';
// import { toBinary } from '@/utils/binary-parser';
import { HubConnection } from '@microsoft/signalr';

interface ISendMessageWebSocketPayload {
	message: Message;
	sender: string;
	receiver: string;
}

export function sendMessageWebSocketEvent(connection: HubConnection, payload: ISendMessageWebSocketPayload) {
	connection.invoke('sendMessage', payload);
	// socket.send(toBinary(JSON.stringify({ event: 'send_message', payload })));
}
