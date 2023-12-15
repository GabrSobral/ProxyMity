import { database } from '../db';

const options = {
	async sent(messageId: string) {
		await database.messages.where({ id: messageId }).modify({ sentAt: new Date() });
	},
	async received(messageId: string) {
		await database.messages.where({ id: messageId }).modify({ receivedAt: new Date() });
	},
};

interface ChangeMessageStatusProps {
	messageId: string;
	status: 'sent' | 'received';
}

export async function changeMessageStatusAsyncDB({ messageId, status }: ChangeMessageStatusProps) {
	await options[status](messageId);
}
