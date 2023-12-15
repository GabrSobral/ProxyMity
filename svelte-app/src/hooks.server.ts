import Credentials from '@auth/sveltekit/providers/credentials';
import { SvelteKitAuth, type SvelteKitAuthConfig } from '@auth/sveltekit';

import { signUpAsync } from '$lib/modules/authentication/services/signUpAsync';
import { signInAsync } from '$lib/modules/authentication/services/signInAsync';

import type { User } from './types/user';

export const authOptions: SvelteKitAuthConfig = {
	pages: {
		signIn: '/auth/sign-in',
		newUser: '/auth/sign-up',
	},
	providers: [
		Credentials({
			id: 'credentials',
			name: 'Credentials',
			credentials: {
				email: { label: 'email', type: 'email' },
				password: { label: 'password', type: 'password' },
			},

			async authorize(credentials): Promise<any> {
				return await new Promise((resolve, reject) => {
					if (!credentials) {
						return null;
					}

					const { email, password } = credentials as { email: string; password: string };

					signInAsync({ email, password }).then(resolve).catch(reject);
				});
			},
		}),

		Credentials({
			id: 'register',
			name: 'Credentials',
			credentials: {
				name: { label: 'name', type: 'text' },
				email: { label: 'email', type: 'email' },
				password: { label: 'password', type: 'password' },
			},

			async authorize(credentials): Promise<any> {
				if (!credentials) {
					return null;
				}

				try {
					const { name, email, password } = credentials as { email: string; password: string; name: string };
					const response = await signUpAsync({ name, email, password });

					return response;
				} catch (error: any) {
					console.error({ error: error.response.data });

					throw new Error(error.response.data.message);
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			return { ...token, ...user };
		},

		async session({ token }): Promise<any> {
			delete token?.jti;
			delete token?.iat;
			delete token?.exp;

			return token as unknown as { user: User; accessToken: string };
		},
	},
};

export const handle = SvelteKitAuth(authOptions);
