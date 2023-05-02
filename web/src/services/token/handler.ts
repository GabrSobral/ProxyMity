const tokenKey = '@ProxyMity-access_token';

export function setToken(token: string) {
	localStorage.setItem(tokenKey, token);
}

export function getToken() {
	const token = localStorage.getItem(tokenKey);

	return token;
}
