import { api } from './config';
import type { Message } from '../../types/message';

interface Request {
	conversationId: string;
}

export type GetConversationMessagesResponse = {
	messages: Message[];
};

export async function APIGetConversationMessages({ conversationId }: Request) {
	const { data } = await api.get<GetConversationMessagesResponse>(`/conversation/messages/${conversationId}`);

	return data;
}
