import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { User } from '@/types/user';

import { signInAsync } from '@/@modules/authentication/services/signInAsync';
import { signUpAsync } from '@/@modules/authentication/services/signUpAsync';

export const nextAuthOptions: NextAuthOptions = {
	pages: {
		signIn: '/auth/sign-in',
		newUser: '/auth/sign-up',
	},
	providers: [
		CredentialsProvider({
			id: 'credentials',
			name: 'Credentials',
			credentials: {
				email: { label: 'email', type: 'email' },
				password: { label: 'password', type: 'password' },
			},

			async authorize(credentials): Promise<any> {
				if (!credentials) {
					return null;
				}

				try {
					const { email, password } = credentials;
					const response = await signInAsync({ email, password });

					return response;
				} catch (error: any) {
					console.error({ error: error.response.data });

					throw new Error(error.response.data.error || error.response.data.message || error.response.data.title);
				}
			},
		}),

		CredentialsProvider({
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
					const { name, email, password } = credentials;
					const response = await signUpAsync({ name, email, password });

					return response;
				} catch (error: any) {
					console.error({ error: error.response.data });

					throw new Error(error.response.data.error || error.response.data.message || error.response.data.title);
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
