import { signalDatabase } from '../signal-database';

export async function setIdentityPairKeyAsyncDB({
	privateKey,
	publicKey,
}: {
	privateKey: Uint8Array;
	publicKey: Uint8Array;
}) {
	const id = await signalDatabase.identityKeysPair.add({
		privateKey,
		publicKey,
	});

	return id;
}
