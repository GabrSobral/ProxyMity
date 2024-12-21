/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';
import { CredentialsSignin } from '@auth/core/errors';

import Github from '@auth/sveltekit/providers/github';
import Credentials from '@auth/sveltekit/providers/credentials';
import { SvelteKitAuth, type SvelteKitAuthConfig } from '@auth/sveltekit';

import { signUpAsync } from '$lib/modules/authentication/services/sign-up-async';
import { signInAsync } from '$lib/modules/authentication/services/sign-in-async';
import {
	EExternalProvider,
	externalLoginAsync
} from '$lib/modules/authentication/services/external-login-async';

import type { User } from './types/user';
import { logError } from './utils/logging';

import {
	AUTH_SECRET,
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,
	JWT_SECRET
} from '$env/static/private';
import { APIGetUserByProviderId } from './services/api/get-user-by-provider-id';

class CustomError extends CredentialsSignin {
	constructor(public code: string) {
		super(code);
	}
}

const authOptions: SvelteKitAuthConfig = {
	secret: AUTH_SECRET,
	trustHost: true,
	pages: {
		signIn: '/auth/login/sign-in',
		newUser: '/auth/login/sign-up'
	},
	cookies: {
		pkceCodeVerifier: {
			name: 'authjs.pkce.code_verifier',
			options: {
				httpOnly: true,
				sameSite: 'none',
				path: '/',
				secure: true
			}
		}
	},
	providers: [
		Github({
			clientId: GITHUB_CLIENT_ID,
			clientSecret: GITHUB_CLIENT_SECRET,
			issuer: 'ProxyMity',

			async profile(account, tokenSet): Promise<any> {
				return {
					accessToken: tokenSet.access_token,
					refreshToken: tokenSet.refresh_token,
					user: {
						id: account.node_id,
						name: account.name,
						email: account.email,
						photoUrl: account.avatar_url
					}
				};
			}
		}),

		Credentials({
			id: 'credentials',
			name: 'Credentials',
			credentials: {
				firstName: { label: 'firstName', type: 'text' },
				lastName: { label: 'lastName', type: 'text' },
				email: { label: 'email', type: 'email' },
				password: { label: 'password', type: 'password' },
				command: { label: 'command', type: 'text' }
			},

			async authorize(credentials): Promise<any> {
				if (!credentials) return { error: 'Credentials not provided' };

				const { command } = credentials;

				if (command === 'sign-in') {
					const { email, password } = credentials as { email: string; password: string };

					try {
						return await signInAsync({ email, password });
					} catch (error: any) {
						logError({ error: error?.response?.data || error.message });

						throw new CustomError(error?.response?.data?.error || error.message);
					}
				} else {
					const { firstName, lastName, email, password } = credentials as {
						email: string;
						password: string;
						firstName: string;
						lastName: string;
					};

					try {
						return await signUpAsync({ firstName, lastName, email, password });
					} catch (error: any) {
						logError({ error: error?.response?.data || error.message });

						throw new CustomError(error?.response?.data?.error || error.message);
					}
				}
			}
		})
	],
	callbacks: {
		jwt: async ({ token, user, trigger, account }) => {
			if (trigger !== 'update' && user) {
				if (account?.provider === 'github') {
					const currentUser = (user as any).user;

					await externalLoginAsync({
						email: currentUser?.email?.toLowerCase() ?? '',
						firstName: currentUser?.name?.split(' ')[0] ?? '',
						lastName: currentUser?.name?.split(' ')[1] ?? '',
						provider:
							account?.provider === 'github' ? EExternalProvider.GITHUB : EExternalProvider.GOOGLE,
						providerKey: (currentUser?.id as string) ?? ''
					});

					const userData = await APIGetUserByProviderId({
						provider: EExternalProvider.GITHUB,
						providerKey: currentUser.id
					});

					const newToken = jwt.sign(
						{
							email: currentUser.email,
							firstName: currentUser?.name?.split(' ')[0] ?? '',
							lastName: currentUser?.name?.split(' ')[1] ?? '',
							iss: 'ProxyMity',
							aud: 'ProxyMity',
							sub: userData.id
						},
						JWT_SECRET,
						{ algorithm: 'HS256', expiresIn: 60 * 60 * 45 } // 45 minutes
					);

					return {
						accessToken: newToken,
						user: {
							id: userData.id,
							providerKey: currentUser.id,
							email: currentUser.email,
							photoUrl: currentUser.photoUrl,
							firstName: currentUser.name.split(' ')?.[0] ?? null,
							lastName: currentUser.name.split(' ')?.[1] ?? null
						}
					};
				}
			}

			return { ...token, ...user };
		},

		async session({ token }): Promise<any> {
			delete token?.jti;
			delete token?.iat;
			delete token?.exp;

			return token as unknown as { user: User; accessToken: string };
		}
	}
};

export const { handle, signIn, signOut } = SvelteKitAuth(authOptions);
