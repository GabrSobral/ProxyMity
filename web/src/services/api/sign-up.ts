import axios from 'axios';
import { User } from '../../types/user';

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_HTTP_API_DOMAIN,
});

interface Request {
	name: string;
	email: string;
	password: string;
}

interface Response {
	data: User;
	access_token: string;
}

export async function APISignUp({ email, password }: Request) {
	const { data } = await api.post<Response>('/contact/sign-up', {
		name,
		email,
		password,
	});

	return data;
}
