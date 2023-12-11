import axios from 'axios';

import { Message } from '@/types/message';
import { Conversation } from '@/types/conversation';
import { IServiceOptions } from '@/types/IServiceOptions';

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_HTTP_API_DOMAIN,
});

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
