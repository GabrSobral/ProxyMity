import { IndexableType } from 'dexie';

import { database } from '../db';
import { Contact } from '../../../types/contact';

export async function registerContactAsyncDB(contact: Contact): Promise<IndexableType> {
	const id = await database.contacts.add(contact);

	return id;
}
