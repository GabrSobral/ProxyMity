import type { User } from './user';
import type { Conversation } from './conversation';

interface TimestampWithAccount {
	at: Date;
	userId: string;
}

export interface ILocalMessage {
	dbId?: number;
	id: string;
	content: string;

	writtenAt: Date;
	sentAt: Date | null;

	received: {
		users: TimestampWithAccount[];
		byAllAt: Date | null;
	};
	read: {
		users: TimestampWithAccount[];
		byAllAt: Date | null;
	};

	conversationId: Conversation['id'];

	repliedMessage: {
		id: ILocalMessage['id'];
		content: ILocalMessage['content'];
	} | null;

	author: {
		id: User['id'];
		name: User['name'];
	};
}

export interface IServerMessage {
	id: string;
	content: string;

	writtenAt: Date;
	sentAt: Date | null;
	receivedByAllAt: Date | null;
	readByAllAt: Date | null;

	conversationId: Conversation['id'];

	repliedMessageId: IServerMessage['id'] | null;

	authorId: User['id'];
}
