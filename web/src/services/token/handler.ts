import { NextPageContext } from 'next';
import nookies, { setCookie } from 'nookies';

const tokenKey = '@ProxyMity-access_token';

export function setToken(token: string, context: Pick<NextPageContext, 'res'> | null = null) {
	setCookie(context, tokenKey, token);
}

export function getToken(context: Pick<NextPageContext, 'req'> | null = null) {
	const token = nookies.get(context, tokenKey);

	return token;
}
