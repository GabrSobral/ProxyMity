import Dexie from 'dexie';
import type { Table } from 'dexie';

class DexieDatabase extends Dexie {
	identityKeysPair!: Table<{
		dbId?: number;
		privateKey: Uint8Array;
		publicKey: Uint8Array;
	}>;
	signedPreKeys!: Table<{
		dbId?: number;
		publicKey: Uint8Array;
	}>;

	constructor() {
		super('signal-database');
		this.version(1).stores({
			identityKeysPair: `
				++dbId,
				privateKey,
				publicKey
			`,
			signedPreKeys: `
				++dbId,
				publicKey
			`,
		});
	}
}

export const signalDatabase = new DexieDatabase();
