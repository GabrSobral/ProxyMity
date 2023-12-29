import { api } from './config';
import type { Message } from '../../types/message';
import type { IServiceOptions } from '../../types/utils/IServiceOptions';

interface Request {
	conversationId: string;
}

export type GetConversationMessagesResponse = Message[];

export async function APIGetConversationMessages({ conversationId }: Request, { accessToken }: IServiceOptions) {
	const { data } = await api.get<GetConversationMessagesResponse>(`/conversation/messages/${conversationId}`, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});

	return { messages: data };
}
