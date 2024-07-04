import type { User } from '../../../../types/user';
import { authApi } from '../../../../services/api/config';

interface Request {
   firstName: string;
   lastName: string;
   email: string;
   password: string;
}

interface Response {
   data: User;
   access_token: string;
}

export type SignUpResponse = Response;

export async function signUpAsync({ firstName, lastName, email, password }: Request): Promise<Response> {
   const { data } = await authApi.post<Response>('/auth/sign-up', {
      firstName,
      lastName,
      email,
      password,
   });

   return data;
}
