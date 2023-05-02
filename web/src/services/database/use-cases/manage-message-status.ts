import { database } from '../db';
import { Message } from '../../../types/message';

const statusFunctions = {
	sent: async (message: Message) => {
		await database.messages.update(message.id, { sentAt: message.sentAt });
	},
	received: async (message: Message) => {
		await database.messages.update(message.id, { receivedAt: message.receivedAt });
	},
};

export async function manageMessageStatusAsyncDB({
	message,
	status,
}: {
	message: Message;
	status: 'sent' | 'received';
}): Promise<void> {
	await statusFunctions[status](message);
}
