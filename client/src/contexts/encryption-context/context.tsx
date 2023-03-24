import { createContext, ReactNode, useEffect } from 'react';

import { generateIdentityKeysPair } from './functions/generateIdentityKeysPair';
import { generateSignatureKey } from './functions/generateSignatureKeysPair';
import { generateOneTimePreKeys } from './functions/generateOneTimePreKeys';
import { generateSignedKey } from './functions/generateSignedKeysPair';

export const EncryptionContext = createContext({});

export function EncryptionProvider({ children }: { children: ReactNode }) {
	const handleFirstAccess = async () => {
		const identityKeysPair = generateIdentityKeysPair();
		const signedKeysPair = generateSignedKey(identityKeysPair.identityPrivateKey);
		const signatureKey = generateSignatureKey(identityKeysPair.identityPrivateKey);
		const oneTimePreKeys = generateOneTimePreKeys(identityKeysPair.identityPrivateKey, 5);

		const firstClientBundle = {
			identityPublicKey: identityKeysPair.identityPublicKey,
			signedPreKey: signedKeysPair,
			oneTimePreKeys,
		};

		console.log(firstClientBundle);

		// await sendKeysToTheServer(firstClientBundle);
	};

	useEffect(() => {
		handleFirstAccess();
	}, []);

	return <EncryptionContext.Provider value={{}}>{children}</EncryptionContext.Provider>;
}
