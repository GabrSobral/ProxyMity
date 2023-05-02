import { IndexableType } from 'dexie';

import { database } from '../db';
import { Message } from '../../../types/message';

export async function addMessageAsyncDB(message: Message): Promise<IndexableType> {
	const id = await database.messages.add(message);

	return id;
}
