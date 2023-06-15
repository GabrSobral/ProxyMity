import { database } from '../db';

interface ReadContactMessagesParams {
	contactId: string;
	userId: string;
	itsMe: boolean;
}

export async function readContactMessagesAsyncDB({
	contactId,
	userId,
	itsMe,
}: ReadContactMessagesParams): Promise<void> {
	const whereClause: {
		contactRef: string;
		readAt: string;
		recipientId?: string;
	} = {
		contactRef: userId + contactId,
		readAt: 'none',
	};

	if (itsMe) {
		whereClause.recipientId = userId;
	} else {
		whereClause.recipientId = contactId;
	}

	await database.messages.where(whereClause).modify({ readAt: new Date() });
}
