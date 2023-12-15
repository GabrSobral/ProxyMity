import { Conversation } from '@/types/conversation';
import { database } from '../db';

export async function getConversationsMessagesAsyncDB(conversationId: Conversation['id']) {
	const messagesCount = await database.messages.where({ conversationId }).count();

	const messages = await database.messages
		.where({ conversationId })
		.offset(messagesCount - 50)
		.toArray();

	return messages;
}
