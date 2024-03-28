import Github from '@auth/sveltekit/providers/github';
import Credentials from '@auth/sveltekit/providers/credentials';
import { SvelteKitAuth, type SvelteKitAuthConfig } from '@auth/sveltekit';

import { signUpAsync } from '$lib/modules/authentication/services/signUpAsync';
import { signInAsync } from '$lib/modules/authentication/services/signInAsync';

import type { User } from './types/user';

import { AUTH_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';

const authOptions: SvelteKitAuthConfig = {
   secret: AUTH_SECRET,
   trustHost: true,
   pages: {
      signIn: '/auth/sign-in',
      newUser: '/auth/sign-up',
   },
   providers: [
      Github({ clientId: GITHUB_CLIENT_ID, clientSecret: GITHUB_CLIENT_SECRET }),

      Credentials({
         id: 'credentials',
         name: 'Credentials',
         credentials: {
            name: { label: 'name', type: 'text' },
            email: { label: 'email', type: 'email' },
            password: { label: 'password', type: 'password' },
            command: { label: 'command', type: 'text' },
         },

         async authorize(credentials): Promise<any> {
            if (!credentials) return { error: 'Credentials not provided' };

            const { command } = credentials;

            if (command === 'sign-in') {
               const { email, password } = credentials as { email: string; password: string };

               try {
                  return await signInAsync({ email, password });
               } catch (error: any) {
                  console.error({ error: error?.response?.data || error.message });

                  return null;
                  throw new Error(JSON.stringify({ error: error?.response?.data || error.message }));
               }
            } else {
               const { name, email, password } = credentials as { email: string; password: string; name: string };

               try {
                  return await signUpAsync({ name, email, password });
               } catch (error: any) {
                  console.error({ error: error?.response?.data });
                  return { error: error?.response?.data };
               }
            }
         },
      }),
   ],
   callbacks: {
      jwt: async ({ token, user }) => ({ ...token, ...user }),

      async session({ token }): Promise<any> {
         delete token?.jti;
         delete token?.iat;
         delete token?.exp;

         return token as unknown as { user: User; accessToken: string };
      },
   },
};

export const { handle, signIn, signOut } = SvelteKitAuth(authOptions);
