import { database } from '../db';

export async function getUserAsyncDB() {
	const user = await database.user.toArray();

	return user[0];
}
