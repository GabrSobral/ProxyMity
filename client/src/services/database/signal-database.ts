import Dexie, { Table } from 'dexie';

import { Contact } from '../../types/contact';
import { Message } from '../../types/message';
import { User } from '../../types/user';

export class DexieDatabase extends Dexie {
	contacts!: Table<Contact>;
	user!: Table<User>;
	messages!: Table<Message>;

	constructor() {
		super('signal-database');
		this.version(1).stores({
			user: `
				++id, 
				name, 
				email, 
				
				createdAt,
				avatarConfig
			`,
			contacts: `
        ++id, 
        name, 
        email, 
				
        lastOnline, 
        registeredAt, 
        createdAt,

				avatarConfig
      `,
			messages: `
				++dbId,
				id,
				content,

				contactRef,
				
				authorId,
				recipientId,

				sentAt,
				receivedAt,
				writtenAt,
				readAt,

				[contactRef+readAt+authorId]
			`,
		});
	}
}

export const database = new DexieDatabase();
