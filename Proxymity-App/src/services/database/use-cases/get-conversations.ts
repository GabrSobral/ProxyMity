import { database } from '../db';

export async function getConversationsAsyncDB() {
   const conversations = await database.conversations.toArray();

   return conversations;
}
