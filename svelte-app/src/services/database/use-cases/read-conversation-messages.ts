import { Conversation } from '@/types/conversation';
import { database } from '../db';

interface ReadContactMessagesParams {
	conversationId: Conversation['id'];
	userId: string;
}

export async function readConversationMessagesAsyncDB({
	conversationId,
	userId,
}: ReadContactMessagesParams): Promise<void> {
	// const whereClause: {
	// 	contactRef: string;
	// 	readAt: string;
	// 	recipientId?: string;
	// } = {
	// 	contactRef: userId + contactId,
	// 	readAt: 'none',
	// };
	// if (itsMe) {
	// 	whereClause.recipientId = userId;
	// } else {
	// 	whereClause.recipientId = contactId;
	// }
	// await database.messages.where(whereClause).modify({ readAt: new Date() });
}
