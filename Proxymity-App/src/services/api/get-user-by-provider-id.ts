import type { EExternalProvider } from '$lib/modules/authentication/services/external-login-async';
import type { IServiceOptions } from '../../types/utils/IServiceOptions';
import { authApi } from './config';

interface Request {
   provider: EExternalProvider;
   providerKey: string;
}

interface Response {
   id: string;
   firstName: string;
   lastName: string | null;
   email: string;
   createdAt: Date;
   updatedAt?: Date;
   isEmailConfirmed: boolean;
}

export async function APIGetUserByProviderId(
   { provider, providerKey }: Request
   // { accessToken }: IServiceOptions
): Promise<Response> {
   const { data } = await authApi.get<Response>(`/users/get-by-id/provider/${provider}/${providerKey}`, {
      // headers: {
      //    Authorization: `Bearer ${accessToken}`,
      // },
   });

   return data;
}
