import { authApi } from '../../../../services/api/config';
import type { IServiceOptions } from '../../../../types/utils/IServiceOptions';

interface Request {
   userId: string;
}

interface Response {
   id: string;
   firstName: string;
   lastName: string | null;
   email: string;
   photoUrl: string;
   createdAt: Date;
}

export async function getUserByIdAsync({ userId }: Request, { accessToken }: IServiceOptions): Promise<Response> {
   const { data } = await authApi.get<Response>(`/users/get-by-id/${userId}`, {
      headers: {
         Authorization: `Bearer ${accessToken}`,
      },
   });

   return data;
}
