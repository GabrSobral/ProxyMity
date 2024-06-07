import type { Conversation } from '../../../types/conversation';
import { database } from '../db';

export async function getConversationByIdAsyncDB(conversationId: Conversation['id']): Promise<Conversation | null> {
   const message = await database.conversations.get({ id: conversationId });

   return message || null;
}
