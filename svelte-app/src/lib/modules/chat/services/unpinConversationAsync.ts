import { api } from '../../../../services/api/config';
import type { IServiceOptions } from '../../../../types/utils/IServiceOptions';

interface Request {
   conversationId: string;
}

export async function unpinConversationAsync({ conversationId }: Request, { accessToken }: IServiceOptions): Promise<void> {
   await api.patch<Response>(`/conversation/${conversationId}/unpin`, null, {
      headers: {
         Authorization: `Bearer ${accessToken}`,
      },
   });
}
