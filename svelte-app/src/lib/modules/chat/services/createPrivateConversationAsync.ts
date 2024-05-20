import { api } from '../../../../services/api/config';
import type { IServiceOptions } from '../../../../types/utils/IServiceOptions';

interface Request {
   participantId: string;
}

interface Response {
   id: string;
   groupId: string;
   createdAt: Date;
   participants: string[];
}

export async function createPrivateConversationAsync(
   { participantId }: Request,
   { accessToken }: IServiceOptions
): Promise<Response> {
   const { data } = await api.post<Response>(
      '/conversations/private',
      { participantId },
      {
         headers: {
            Authorization: `Bearer ${accessToken}`,
         },
      }
   );

   return data;
}
