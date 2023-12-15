import { signalDatabase } from '../signal-database';

export async function getIdentityPairKeyAsyncDB() {
	const [identityKeysPair] = await signalDatabase.identityKeysPair.toArray();

	return identityKeysPair;
}
