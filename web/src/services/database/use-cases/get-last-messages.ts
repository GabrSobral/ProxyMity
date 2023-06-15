import { database } from '../db';

interface Props {
	contactRef: string;
}

export async function getLastMessageAsyncDB({ contactRef }: Props) {
	const lastMessage = await database.messages.where({ contactRef }).last();

	return lastMessage;
}
