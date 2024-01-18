// import { toBinary } from '@/utils/binary-parser';
import { HubConnection } from '@microsoft/signalr';
import type { ILocalMessage, IServerMessage } from '../../../../../../types/message';

interface ISendMessageWebSocketPayload {
   message: ILocalMessage;
   isConversationGroup: boolean;
}

export function sendMessageWebSocketEvent(connection: HubConnection, payload: ISendMessageWebSocketPayload) {
   const serverMessage: IServerMessage = {
      id: payload.message.id,
      authorId: payload.message.author.id,
      content: payload.message.content,
      conversationId: payload.message.conversationId,
      readByAllAt: payload.message.read.byAllAt,
      receivedByAllAt: payload.message.received.byAllAt,
      sentAt: payload.message.sentAt,
      writtenAt: payload.message.writtenAt,
      repliedMessageId: payload.message.repliedMessage?.id || null,
   };

   connection.invoke('onSendMessage', { message: serverMessage, isConversationGroup: payload.isConversationGroup });
   // socket.send(toBinary(JSON.stringify({ event: 'send_message', payload })));
}
