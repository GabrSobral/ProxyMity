import { database } from '../db';

export async function getContactMessagesAsyncDB(contactId: string) {
	const messages = await database.messages.where({ recipientId: contactId });

	return messages;
}
