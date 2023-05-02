import axios from 'axios';
import { Contact } from '../../types/contact';

const api = axios.create({
	baseURL: 'http://localhost:3001',
});

interface Request {
	id: string;
}

interface Response {
	data: Contact;
}

export async function APISearchContactById({ id }: Request) {
	const { data } = await api.get<Response>(`/contact/search-by-id/${id}`);

	return data;
}
