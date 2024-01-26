import { getMessageByIdAsyncDB } from '../../../../../../services/database/use-cases/get-message-by-id';
import type { ILocalMessage, IServerMessage } from '../../../../../../types/message';

export async function serverToLocalMessage(
   message: IServerMessage,
   conversationIsGroup: boolean,
   currentUserId: string
): Promise<ILocalMessage> {
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
      received: {
         byAllAt: message.receivedByAllAt,
         users: conversationIsGroup
            ? []
            : message.receivedByAllAt
              ? [{ at: message.receivedByAllAt!, userId: currentUserId }]
              : [],
      },
      sentAt: message.sentAt,
      read: {
         byAllAt: message.readByAllAt,
         users: conversationIsGroup
            ? []
            : message.readByAllAt
              ? [{ at: message.readByAllAt!, userId: currentUserId }]
              : [],
      },
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
      repliedMessage: null,
   };

   return serverMessage;
}
