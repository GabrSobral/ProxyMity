import type { User } from '../../../../types/user';
import { authApi } from '../../../../services/api/config';

interface Request {
   email: string;
   password: string;
}

export interface SignInResponse {
   user: User;
   accessToken: string;
}

export async function signInAsync({ email, password }: Request): Promise<SignInResponse> {
   const { data } = await authApi.post<SignInResponse>('/auth/sign-in', {
      email,
      password,
   });

   return data;
}
