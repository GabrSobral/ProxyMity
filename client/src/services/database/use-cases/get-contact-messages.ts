import { database } from '../db';

export async function getContactMessagesAsyncDB(contactId: string) {
	const messages = await database.messages
		.where({ recipientId: contactId })
		.or('authorId')
		.equalsIgnoreCase(contactId)
		.limit(100)
		.sortBy('writtenAt');

	return messages;
}
