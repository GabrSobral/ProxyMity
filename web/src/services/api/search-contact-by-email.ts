import axios from 'axios';
import { Contact } from '../../types/contact';

const api = axios.create({
	baseURL: 'http://localhost:3001',
});

interface Request {
	email: string;
}

interface Response {
	data: Contact;
}

export async function APISearchContactByEmail({ email }: Request) {
	const { data } = await api.get<Response>(`/contact/search-by-email/${email}`);

	return data;
}