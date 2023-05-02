import { Contact } from './contact';

export interface Message {
	dbId?: number;

	id: string;
	content: string;

	contactRef?: string;

	recipientId: Contact['id'];
	authorId: Contact['id'];

	writtenAt: Date;
	sentAt: Date | 'none';
	receivedAt: Date | 'none';
	readAt: Date | 'none';
}
