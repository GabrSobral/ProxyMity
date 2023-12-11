import axios from 'axios';
import { User } from '../../types/user';

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_HTTP_API_DOMAIN,
});

interface Request {
	email: string;
	password: string;
}

export interface SignInResponse {
	user: User;
	accessToken: string;
}

export async function APISignIn({ email, password }: Request) {
	const { data } = await api.post<SignInResponse>('/auth/sign-in', {
		email,
		password,
	});

	return data;
}
