import { database } from '../db';

export async function getContactMessagesAsyncDB(contactRef: string) {
	const { messages, notifications } = await database.transaction('r', database.messages, async () => {
		const messagesCount = await database.messages.where({ contactRef }).count();

		const messagesNotReadCount = await database.messages.where({ contactRef, readAt: 'none' }).count();

		const messages = await database.messages
			.where({ contactRef })
			.offset(messagesCount - 50)
			.toArray();

		return { messages, notifications: messagesNotReadCount };
	});

	return { messages, notifications };
}
