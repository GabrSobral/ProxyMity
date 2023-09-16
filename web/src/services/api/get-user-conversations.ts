import { Conversation } from '@/types/conversation';
import { Message } from '@/types/message';
import axios from 'axios';

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_HTTP_API_DOMAIN,
});

interface Request {
	id: string;
}

export type GetUserConversationsResponse = (Conversation & { lastMessages: Message[]; unreadMessagesCount: number })[];

export async function APIGetUserConversations({ id }: Request) {
	const { data } = await api.get<GetUserConversationsResponse>(`/conversation/get-by-user/${id}`);

	return data;
}
