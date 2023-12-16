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
				name: { label: 'name', type: 'text' },
				email: { label: 'email', type: 'email' },
				password: { label: 'password', type: 'password' },
				command: { label: 'command', type: 'text' },
			},

			async authorize(credentials): Promise<any> {
				if (!credentials) {
					return { error: 'Credentials not provided' };
				}

				console.log(credentials);

				const { command } = credentials;

				if (command === 'sign-in') {
					const { email, password } = credentials as { email: string; password: string };

					try {
						const response = await signInAsync({ email, password });
						console.log({ response });

						return response;
					} catch (error: any) {
						console.error({ error: error?.response?.data });
						return { error };
					}
				} else {
					const { name, email, password } = credentials as { email: string; password: string; name: string };

					try {
						const response = await signUpAsync({ name, email, password });
						console.log({ response });

						return response;
					} catch (error: any) {
						console.error({ error: error?.response?.data });
						return { error };
					}
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
