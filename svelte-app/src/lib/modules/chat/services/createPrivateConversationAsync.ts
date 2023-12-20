import { api } from '../../../../services/api/config';
import type { IServiceOptions } from '../../../../types/utils/IServiceOptions';

interface Request {
	participantId: string;
}

interface Response {
	id: string;
	name: string;
	email: string;
	photoUrl: string;
	createdAt: Date;
}

export async function createPrivateConversationAsync(
	{ participantId }: Request,
	{ accessToken }: IServiceOptions
): Promise<Response> {
	const { data } = await api.post<Response>(
		'/conversation/private',
		{ participantId },
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	);

	return data;
}
