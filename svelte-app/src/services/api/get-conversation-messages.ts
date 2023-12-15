import axios from 'axios';

import type { Message } from '../../types/message';

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_HTTP_API_DOMAIN,
});

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
