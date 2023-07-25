import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { APISignIn } from '@/services/api/sign-in';
import { User } from '@/types/user';

export const nextAuthOptions: NextAuthOptions = {
	pages: {
		signIn: '/auth/sign-in',
		newUser: '/auth/sign-up',
	},
	providers: [
		CredentialsProvider({
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
					const response = await APISignIn({ email, password });

					return { user: response.data, accessToken: response.access_token };
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
			delete token.jti;
			delete token.iat;
			delete token.exp;

			return token as unknown as { user: User; accessToken: string };
		},
	},
};
