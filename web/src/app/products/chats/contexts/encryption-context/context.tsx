'use client';

import { createContext, ReactNode, useEffect } from 'react';

import { generateSignedKey } from './functions/generateSignedKeysPair';
import { generateOneTimePreKeys } from './functions/generateOneTimePreKeys';
import { generateIdentityKeysPair } from './functions/generateIdentityKeysPair';

import { setIdentityPairKeyAsyncDB } from '@/services/database/signalProtocol/use-cases/setIdentityPairKeys';
import { getIdentityPairKeyAsyncDB } from '@/services/database/signalProtocol/use-cases/getIdentityPairKeys';
import { setSignedPairPreKeysAsyncDB } from '@/services/database/signalProtocol/use-cases/setSignedPairPreKeys';

export const EncryptionContext = createContext({});

export function EncryptionProvider({ children }: { children: ReactNode }) {
	const handleFirstAccess = async () => {
		const identityKeysPair = generateIdentityKeysPair();
		const signedKeysPair = generateSignedKey(identityKeysPair.privateKey);
		const oneTimePreKeys = generateOneTimePreKeys(identityKeysPair.privateKey, 100);

		setIdentityPairKeyAsyncDB(identityKeysPair);
		setSignedPairPreKeysAsyncDB({ publicKey: signedKeysPair });

		const firstClientBundle = {
			identityPublicKey: identityKeysPair.privateKey,
			signedPreKey: signedKeysPair,
			oneTimePreKeys,
		};

		console.log(firstClientBundle);

		// await sendKeysToTheServer(firstClientBundle);
	};

	useEffect(() => {
		getIdentityPairKeyAsyncDB().then(keys => {
			if (!keys) handleFirstAccess();
		});
	}, []);

	return <EncryptionContext.Provider value={{}}>{children}</EncryptionContext.Provider>;
}
