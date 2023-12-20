import { api } from '../../../../services/api/config';
import type { IServiceOptions } from '../../../../types/utils/IServiceOptions';

interface Request {
	userEmail: string;
}

interface Response {
	id: string;
	name: string;
	email: string;
	photoUrl: string;
	createdAt: Date;
}

export async function getUserByEmailAsync({ userEmail }: Request, { accessToken }: IServiceOptions): Promise<Response> {
	const { data } = await api.get<Response>(`/user/get-by-email/${userEmail}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	return data;
}
