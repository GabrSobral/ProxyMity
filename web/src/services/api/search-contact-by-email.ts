import axios from 'axios';
import { Contact } from '../../types/contact';

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_HTTP_API_DOMAIN,
});

interface Request {
	email: string;
}

interface Response {
	data: Contact;
}

export async function APISearchContactByEmail({ email }: Request) {
	const { data } = await api.get<Response>(`/user/search-by-email/${email}`);

	return data;
}
