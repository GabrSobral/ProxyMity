import { chatApi } from '../../../../services/api/config';
import type { IServiceOptions } from '../../../../types/utils/IServiceOptions';

interface Request {
   conversationId: string;
}

export async function unpinConversationAsync({ conversationId }: Request, { accessToken }: IServiceOptions): Promise<void> {
   await chatApi.patch<Response>(`/conversations/${conversationId}/unpin`, null, {
      headers: {
         Authorization: `Bearer ${accessToken}`,
      },
   });
}
