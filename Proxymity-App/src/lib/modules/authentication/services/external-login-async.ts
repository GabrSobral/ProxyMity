import type { User } from '../../../../types/user';
import { authApi } from '../../../../services/api/config';

export enum EExternalProvider {
   GITHUB,
   GOOGLE,
}

interface Request {
   provider: EExternalProvider;
   providerKey: string;
   email: string;
   firstName: string;
   lastName: string;
}

export interface SignInResponse {
   user: User;
   accessToken: string;
}

export async function externalLoginAsync({
   email,
   firstName,
   lastName,
   provider,
   providerKey,
}: Request): Promise<SignInResponse> {
   console.log('kqwkamoiwdjqiojeoiqj2oiejqoiwjeoiqjeoiqjwdoqjdoiqjdoiqjdoqiwjdoiqjdoqijwdoqiwjdoqijdqowijd');
   const { data } = await authApi.post<SignInResponse>('/auth/external-provider', {
      email,
      provider,
      providerKey,
      firstName,
      lastName,
   });

   return data;
}
