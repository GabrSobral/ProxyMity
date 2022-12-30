import Dexie, { Table } from 'dexie';

import { Contact } from '../../types/contact';
import { Message } from '../../types/message';
import { User } from '../../types/user';

export class DexieDatabase extends Dexie {
	contacts!: Table<Contact>;
	user!: Table<User>;
	messages!: Table<Message>;

	constructor() {
		super('realchat');
		this.version(1).stores({
			user: `
				++id, 
				name, 
				email, 
				
				createdAt
			`,
			contacts: `
        ++id, 
        name, 
        email, 
				
        lastOnline, 
        registeredAt, 
        createdAt
      `,
			messages: `
				++id,
				content,
				
				authorId,
				recipientId,

				sentAt,
				receivedAt,
				writtenAt,
				readAt
			`,
		});
	}
}

export const database = new DexieDatabase();
