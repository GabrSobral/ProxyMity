import { getMessageByIdAsyncDB } from '../../../../../../services/database/use-cases/get-message-by-id';
import type { ILocalMessage, IServerMessage } from '../../../../../../types/message';

export async function serverToLocalMessage(message: IServerMessage): Promise<ILocalMessage> {
   return {
      id: message.id,
      content: message.content,
      conversationId: message.conversationId,
      writtenAt: message.writtenAt,
      author: { id: message.authorId, name: 'name' },
      repliedMessage: message.repliedMessageId
         ? {
              id: message.repliedMessageId,
              content: await (async () => {
                 const repliedMessage = await getMessageByIdAsyncDB(message.repliedMessageId!);
                 return repliedMessage?.content || '';
              })(),
           }
         : null,
      received: { byAllAt: message.receivedByAllAt, users: [] },
      sentAt: message.sentAt,
      read: { byAllAt: null, users: []} 
   };
}

export async function localToServerMessage(message: ILocalMessage): Promise<IServerMessage> {
    const serverMessage: IServerMessage = {
        id: message.id,
        authorId: message.author.id,
        content: message.content,
        conversationId: message.conversationId,
        readByAllAt: message.read.byAllAt,
        receivedByAllAt: message.received.byAllAt,
        sentAt: message.sentAt,
        writtenAt: message.writtenAt,
        repliedMessageId: message.repliedMessage?.id || null,
     };

    return serverMessage;
 }
