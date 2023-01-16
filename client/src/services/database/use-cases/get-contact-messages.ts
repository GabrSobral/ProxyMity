import { database } from '../db';

export async function getContactMessagesAsyncDB(contactRef: string) {
	const messages = await database.transaction('r', database.messages, async () => {
		const messagesCount = await database.messages.where({ contactRef }).count();

		return await database.messages
			.where({ contactRef })
			.offset(messagesCount - 50)
			.toArray();
	});

	return messages;
}
