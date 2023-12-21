import type { User } from './user';
import type { Conversation } from './conversation';

export interface Message {
	dbId?: number;
	id: string;
	content: string;

	writtenAt: Date;
	sentAt: Date | null;
	receivedByAllAt: Date | null;
	readByAllAt: Date | null;

	conversationId: Conversation['id'];
	repliedMessage: Message | Message['id'] | null;
	authorId: User['id'];
}
