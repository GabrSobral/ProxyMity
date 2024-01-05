import { EMessageStatuses } from '../../../enums/EMessageStatuses';
import { database } from '../db';

interface ChangeMessageStatusProps {
	messageId: string;
	status: EMessageStatuses;
}

export async function changeMessageStatusAsyncDB({ messageId, status }: ChangeMessageStatusProps) {
	if (status === EMessageStatuses.RECEIVED) {
		await database.messages.where({ id: messageId }).modify({ receivedByAllAt: new Date() });
	}

	if (status === EMessageStatuses.SENT) {
		await database.messages.where({ id: messageId }).modify({ sentAt: new Date() });
	}
}
