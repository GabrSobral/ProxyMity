import { api } from './config';

import type { IServerMessage } from '../../types/message';
import type { IServiceOptions } from '../../types/utils/IServiceOptions';

interface Request {
   id: string;
}

export interface IConversationAPI {
   conversation: {
      id: string;
      createdAt: Date;
      groupName: null | string;
      groupDescription: null | string;
      groupId: null | string;
   };
   unreadMessagesCount: number;
   participants: {
      id: string;
      name: string;
      email: string;
      photoUrl: string | null;
      lastOnline: null | Date;
      createdAt: Date;
      removedAt: Date | null;
   }[];
   lastMessages: IServerMessage[];
}

export type GetUserConversationsResponse = IConversationAPI[];

export async function APIGetUserConversations({ id }: Request, { accessToken }: IServiceOptions) {
   const { data } = await api.get<GetUserConversationsResponse>(`/conversation/get-by-user/${id}`, {
      headers: {
         Authorization: `Bearer ${accessToken}`,
      },
   });

   return data;
}
