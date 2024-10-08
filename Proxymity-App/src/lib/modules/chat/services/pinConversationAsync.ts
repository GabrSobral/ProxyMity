import { chatApi } from '../../../../services/api/config';
import type { IServiceOptions } from '../../../../types/utils/IServiceOptions';

interface Request {
   conversationId: string;
}

export async function pinConversationAsync({ conversationId }: Request, { accessToken }: IServiceOptions): Promise<void> {
   await chatApi.patch<Response>(`/conversations/${conversationId}/pin`, null, {
      headers: {
         Authorization: `Bearer ${accessToken}`,
      },
   });
}
