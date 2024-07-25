import { authApi } from '../../../../services/api/config';
import type { IServiceOptions } from '../../../../types/utils/IServiceOptions';

interface Request {
   userEmail: string;
}

interface Response {
   id: string;
   firstName: string;
   lastName: string | null;
   email: string;
   photoUrl: string;
   createdAt: Date;
}

export async function getUserByEmailAsync({ userEmail }: Request, { accessToken }: IServiceOptions): Promise<Response> {
   const { data } = await authApi.get<Response>(`/users/get-by-email/${userEmail}`, {
      headers: {
         Authorization: `Bearer ${accessToken}`,
      },
   });

   return data;
}
