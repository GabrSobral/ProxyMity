import { database } from '../db';

export async function getContactNotificationCountAsyncDB({
	contactRef,
	userId,
}: {
	contactRef: string;
	userId: string;
}) {
	const messagesNotReadCount = await database.messages
		.where({ contactRef, readAt: 'none', recipientId: userId })
		.count();

	return messagesNotReadCount;
}
