import { api } from '../../../../services/api/config';
import type { IServiceOptions } from '../../../../types/utils/IServiceOptions';

interface Request {
   conversationId: string;
}

export async function pinConversationAsync({ conversationId }: Request, { accessToken }: IServiceOptions): Promise<void> {
   await api.patch<Response>(`/conversation/${conversationId}/pin`, null, {
      headers: {
         Authorization: `Bearer ${accessToken}`,
      },
   });
}
