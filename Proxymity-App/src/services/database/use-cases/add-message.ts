import type { IndexableType } from 'dexie';

import { database } from '../db';
import type { ILocalMessage } from '../../../types/message';

export async function addMessageAsyncDB(message: ILocalMessage): Promise<IndexableType> {
   const id = await database.messages.add(message);

   return id;
}
