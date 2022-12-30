import { IndexableType } from 'dexie';

import { database } from '../db';
import { User } from '../../../types/user';

export async function saveUserAsyncDB(user: User): Promise<IndexableType> {
	const id = await database.user.add(user);

	return id;
}
