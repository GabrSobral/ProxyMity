import { database } from '../db';
import type { ILocalMessage } from '../../../types/message';

export async function getMessageByIdAsyncDB(messageId: ILocalMessage['id']): Promise<ILocalMessage | null> {
   const message = await database.messages.get({ id: messageId });

   return message || null;
}
