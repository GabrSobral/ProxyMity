import { database } from '../db';

interface Props {
	contactId: string;
}

export async function getLastMessage({ contactId }: Props) {
	const lastMessage = await database.messages
		.where({ recipientId: contactId })
		.or('authorId')
		.equalsIgnoreCase(contactId)
		.toArray();

	console.log(lastMessage);
}
