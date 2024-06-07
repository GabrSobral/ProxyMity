import { database } from '../db';
import type { GetUserConversationsResponse } from '../../api/get-user-conversations';

export async function getConversationCacheAsyncDB({
   userId,
}: {
   userId: string;
}): Promise<GetUserConversationsResponse> {
   const conversations = await database.conversations.toArray();

   const result = await Promise.all(
      conversations.map(async conversation => {
         const conversationId = conversation.id;

         const lastMessages = await database.messages.where({ conversationId }).reverse().limit(5).toArray();
         const unreadMessages = await database.messages
            .where({ conversationId, readByAllAt: null, authorId: userId })
            .count();

         const state: GetUserConversationsResponse[0] = {
            ...conversation,
            lastMessages,
            unreadMessagesCount: unreadMessages,
         };

         return state;
      })
   );

   return result;
}
