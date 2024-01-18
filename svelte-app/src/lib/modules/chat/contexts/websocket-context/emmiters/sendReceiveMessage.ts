// import { toBinary } from '@/utils/binary-parser';
import { HubConnection } from '@microsoft/signalr';

interface ISendTypingWebSocketPayload {
   messageId: string;
   conversationId: string;
   userId: string;
   isConversationGroup: boolean;
}

export function sendReceiveMessageWebSocketEvent(connection: HubConnection, payload: ISendTypingWebSocketPayload) {
   // socket.send(toBinary(JSON.stringify({ event: 'send_receive_message', payload })));
   connection.invoke('onSendReceiveMessage', payload);
}
