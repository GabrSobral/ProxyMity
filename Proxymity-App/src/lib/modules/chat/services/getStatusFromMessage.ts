import { chatApi } from '../../../../services/api/config';
import type { IServiceOptions } from '../../../../types/utils/IServiceOptions';

interface Request {
   messageId: string;
   conversationId: string;
}

type Response = {
   userId: string;
   messageId: string;
   readAt: Date | null;
   receivedAt: Date | null;
}[];

export async function getStatusFromMessage(
   { messageId, conversationId }: Request,
   { accessToken }: IServiceOptions
): Promise<Response> {
   const { data } = await chatApi.get<Response>(`/messages/status/${conversationId}/${messageId}`, {
      headers: {
         Authorization: `Bearer ${accessToken}`,
      },
   });

   return data;
}
