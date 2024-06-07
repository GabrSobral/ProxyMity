import type { IndexableType } from 'dexie';

import { database } from '../db';
import type { Conversation } from '../../../types/conversation';
import type { IConversationAPI } from '../../api/get-user-conversations';

export async function saveConversationsAsyncDB(dbConversations: IConversationAPI[]): Promise<void> {
   const indexedConversation: Conversation[] = dbConversations.map(item => ({
      id: item.conversation.id,
      groupName: item.conversation.groupName,
      groupDescription: item.conversation.groupDescription,
      isGroup: !!item.conversation.groupId,
      createdAt: item.conversation.createdAt,
      participants: item.participants,
   }));

   await database.conversations.bulkPut(indexedConversation);
}
