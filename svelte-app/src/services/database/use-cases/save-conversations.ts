import type { IndexableType } from 'dexie';

import { database } from '../db';
import type { Conversation } from '../../../types/conversation';

export async function saveConversationsAsyncDB(conversations: Conversation[]): Promise<IndexableType> {
	const id = await database.conversations.bulkPut(conversations);

	return id;
}
