import Dexie, { Table } from 'dexie';

import { Contact } from '../types/contact';
import { Message } from '../types/message';

export const database = new Dexie('realchat');

export class DexieDatabase extends Dexie {
	contacts!: Table<Contact>;
	messages!: Table<Message>;

	constructor() {
		super('realchat');
	}
}

database.version(1).stores({
	contacts: '++id name email ',
});
