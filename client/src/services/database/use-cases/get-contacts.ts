import { database } from '../db';

export async function getContactsAsyncDB() {
	const contacts = await database.contacts.toArray();

	return contacts;
}
