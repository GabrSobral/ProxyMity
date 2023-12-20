import { api } from './config';

import type { Message } from '../../types/message';
import type { Conversation } from '../../types/conversation';
import type { IServiceOptions } from '../../types/utils/IServiceOptions';

interface Request {
	id: string;
}

export type GetUserConversationsResponse = (Conversation & { lastMessages: Message[]; unreadMessagesCount: number })[];

export async function APIGetUserConversations({ id }: Request, { accessToken }: IServiceOptions) {
	const { data } = await api.get<GetUserConversationsResponse>(`/conversation/get-by-user/${id}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	return data;
}
