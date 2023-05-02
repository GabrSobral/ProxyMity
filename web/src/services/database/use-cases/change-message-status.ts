import { database } from '../db';

const options = {
	async sent(messageId: string) {
		await database.messages.update(messageId, { sentAt: new Date() });
	},
	async received(messageId: string) {
		await database.messages.update(messageId, { receivedAt: new Date() });
	},
};

interface ChangeMessageStatusProps {
	messageId: string;
	status: 'sent' | 'received';
}

export async function changeMessageStatus({ messageId, status }: ChangeMessageStatusProps) {
	await options[status](messageId);
}
