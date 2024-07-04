import { authApi } from '../../../../services/api/config';
import type { IServiceOptions } from '../../../../types/utils/IServiceOptions';

interface Request {
   token: string;
}

export async function confirmEmailAsync({ token }: Request, { accessToken }: IServiceOptions): Promise<void> {
   await authApi.post(
      '/auth/confirm-email',
      { token },
      {
         headers: {
            Authorization: `Bearer ${accessToken || '<no-token-provided>'}`,
         },
      }
   );
}
