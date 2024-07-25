import { chatApi } from './config';
import type { IServerMessage } from '../../types/message';
import type { IServiceOptions } from '../../types/utils/IServiceOptions';

interface Request {
   conversationId: string;
}

export type GetConversationMessagesResponse = IServerMessage[];

export async function APIGetConversationMessages({ conversationId }: Request, { accessToken }: IServiceOptions) {
   const { data } = await chatApi.get<GetConversationMessagesResponse>(`/conversations/${conversationId}/messages`, {
      headers: { Authorization: `Bearer ${accessToken}` },
   });

   return { messages: data };
}
