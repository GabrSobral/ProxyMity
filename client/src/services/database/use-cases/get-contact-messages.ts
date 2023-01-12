import { database } from '../db';

export async function getContactMessagesAsyncDB(contactId: string) {
	const messages = await database.messages
		.where({ recipientId: contactId })
		.or('authorId')
		.equalsIgnoreCase(contactId)
		.limit(5)
		.toArray();

	return messages;
}
