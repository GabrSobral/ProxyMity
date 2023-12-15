import type { User } from '../../../../types/user';
import { api } from '../../../../services/api/config';

interface Request {
	name: string;
	email: string;
	password: string;
}

interface Response {
	data: User;
	access_token: string;
}

export type SignUpResponse = Response;

export async function signUpAsync({ name, email, password }: Request): Promise<Response> {
	const { data } = await api.post<Response>('/auth/sign-up', {
		name,
		email,
		password,
	});

	return data;
}
