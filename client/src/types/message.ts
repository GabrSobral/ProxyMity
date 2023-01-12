import { Contact } from './contact';

export interface Message {
	orderId: number;

	id: string;
	content: string;

	recipientId: Contact['id'];
	authorId: Contact['id'];

	writtenAt: Date;
	sentAt: Date | null;
	receivedAt: Date | null;
	readAt: Date | null;
}
