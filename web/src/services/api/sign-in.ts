import axios from 'axios';
import { User } from '../../types/user';

const api = axios.create({
	baseURL: 'http://localhost:3001',
});

interface Request {
	email: string;
	password: string;
}

interface Response {
	data: User;
	access_token: string;
}

export async function APISignIn({ email, password }: Request) {
	const { data } = await api.post<Response>('/contact/sign-in', {
		email,
		password,
	});

	return data;
}