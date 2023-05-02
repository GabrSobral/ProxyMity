import { database } from '../db';

export async function readContactMessages({
	contactId,
	userId,
}: {
	contactId: string;
	userId: string;
}) {
	await database.messages
		.where({
			contactRef: userId + contactId,
			readAt: 'none',
			authorId: userId,
		})
		.modify({ readAt: new Date() });
}
